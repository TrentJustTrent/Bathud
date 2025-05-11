import {bind, GLib, Variable} from "astal"
import Hyprland from "gi://AstalHyprland"
import {CalendarWindowName} from "../calendar/Calendar"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"
import {getMicrophoneIcon, getVolumeIcon, playBatteryWarning} from "../utils/audio"
import {getNetworkIconBinding} from "../utils/network"
import {getBatteryIcon} from "../utils/battery"
import {execAsync} from "astal/process"
import {SystemMenuWindowName} from "../systemMenu/SystemMenuWindow";
import Bluetooth from "gi://AstalBluetooth"
import {activeVpnConnections} from "../systemMenu/widgets/NetworkControls";
import {isRecording, ScreenshotWindowName} from "../screenshot/Screenshot";
import Divider from "../common/Divider";
import {config, projectDir, selectedBar} from "../../config/config";
import Tray from "gi://AstalTray"
import {toggleWindow} from "../utils/windows";
import {AppLauncherWindowName} from "../appLauncher/AppLauncher";
import {Gtk} from "astal/gtk4";
import {ClipboardManagerWindowName} from "../clipboardManager/ClipboardManager";
import PowerProfiles from "gi://AstalPowerProfiles"
import {getPowerProfileIconBinding} from "../utils/powerProfile";
import CavaWaveform from "../cava/CavaWaveform";
import {getCavaFlipStartValue} from "../utils/cava";
import {Mpris} from "../utils/mpris";
import MprisControlButtons from "../mpris/MprisControlButtons";
import MprisTrackInfo from "../mpris/MprisTrackInfo";
import {Bar} from "../../config/bar";
import Notifd from "gi://AstalNotifd"
import {NotificationHistoryWindowName} from "../notification/NotificationHistoryWindow";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import OkButton, {OkButtonHorizontalPadding} from "../common/OkButton";
import {runColorPicker} from "../utils/colorPicker";
import {lock, logout, restart, shutdown} from "../utils/powerOptions";

const tray = Tray.get_default()

function groupByProperty(
    array: Hyprland.Workspace[],
): Hyprland.Workspace[][] {
    const map = new Map<Hyprland.Monitor, Hyprland.Workspace[]>();

    array.forEach((item) => {
        const key = item.monitor;
        if (key === null) {
            return
        }
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.unshift(item);
    });

    return Array.from(map.values()).sort((a, b) => {
        return a[0].monitor.id - b[0].monitor.id
    });
}

function Workspaces({vertical}: { vertical: boolean }) {
    const hypr = Hyprland.get_default()

    return <box
        vertical={vertical}>
        {bind(hypr, "workspaces").as((workspaces) => {
            const groupedWorkspaces = groupByProperty(workspaces)
            return groupedWorkspaces.map((workspaceGroup, index) => {
                return <box
                    vertical={vertical}>
                    {index > 0 && index < groupedWorkspaces.length &&
                        <Divider
                            thin={true}
                            marginStart={4}
                            marginEnd={4}/>
                    }
                    {workspaceGroup.sort((a, b) => {
                        return a.id - b.id
                    }).map((workspace) => {
                        return <OkButton
                            offset={1}
                            hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
                            label={bind(workspace.monitor, "activeWorkspace").as((activeWorkspace) =>
                                activeWorkspace?.id === workspace.id ? "" : ""
                            )}
                            onClicked={() => {
                                hypr.dispatch("workspace", `${workspace.id}`)
                            }}/>
                    })}
                </box>
            })
        })}
    </box>
}

function Clock({vertical}: { vertical: boolean }) {
    let format: string

    if (vertical) {
        format = "%I\n%M"
    } else {
        format = "%I:%M"
    }

    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <OkButton
        hexpand={vertical}
        hpadding={vertical ? OkButtonHorizontalPadding.NONE : OkButtonHorizontalPadding.THIN}
        label={time()}
        onClicked={() => {
            toggleWindow(CalendarWindowName)
        }}/>
}

function VpnIndicator({vertical}: { vertical: boolean }) {
    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label="󰯄"
        visible={activeVpnConnections().as((connections) => {
            return connections.length !== 0
        })}/>
}

function ScreenRecordingStopButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        warning={true}
        label=""
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        visible={isRecording()}
        onClicked={() => {
            execAsync("pkill wf-recorder")
                .catch((error) => {
                    console.error(error)
                })
        }}/>
}

function AudioOut({vertical}: { vertical: boolean }) {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker

    const speakerVar = Variable.derive([
        bind(defaultSpeaker, "description"),
        bind(defaultSpeaker, "volume"),
        bind(defaultSpeaker, "mute")
    ])

    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label={speakerVar(() => getVolumeIcon(defaultSpeaker))}/>
}

function AudioIn({vertical}: { vertical: boolean }) {
    const {defaultMicrophone} = Wp.get_default()!.audio

    const micVar = Variable.derive([
        bind(defaultMicrophone, "description"),
        bind(defaultMicrophone, "volume"),
        bind(defaultMicrophone, "mute")
    ])

    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label={micVar(() => getMicrophoneIcon(defaultMicrophone))}/>
}

function BluetoothIndicator({vertical}: { vertical: boolean }) {
    const bluetooth = Bluetooth.get_default()
    return <OkButton
        label="󰂯"
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        visible={bind(bluetooth, "isPowered").as((isPowered) => {
            return isPowered
        })}/>
}

function NetworkIndicator({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={1}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label={getNetworkIconBinding()}/>
}

function BatteryIndicator({vertical}: { vertical: boolean }) {
    const battery = Battery.get_default()

    let batteryWarningInterval: GLib.Source | null = null

    const batteryVar = Variable.derive([
        bind(battery, "percentage"),
        bind(battery, "state")
    ])

    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        warning={batteryVar((value) => {
            if (value[0] > 0.04 || battery.state === Battery.State.CHARGING) {
                if (batteryWarningInterval != null) {
                    batteryWarningInterval.destroy()
                    batteryWarningInterval = null
                }
                return false
            } else {
                if (batteryWarningInterval === null && battery.isBattery) {
                    batteryWarningInterval = setInterval(() => {
                        playBatteryWarning()
                    }, 120_000)
                    playBatteryWarning()
                }
                return true
            }
        })}
        label={batteryVar(() => getBatteryIcon(battery))}
        visible={bind(battery, "isBattery")}/>
}

function MenuButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={1}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label={vertical ? config.verticalBar.menu.icon : config.horizontalBar.menu.icon}
        onClicked={() => {
            toggleWindow(SystemMenuWindowName)
        }}/>
}

function IntegratedTray({vertical}: { vertical: boolean }) {
    return <TrayContent vertical={vertical}/>
}

function TrayButton() {
    return <OkButton
        offset={1}
        visible={bind(tray, "items").as((items) => items.length > 0)}
        label={"󱊔"}
        menuButtonContent={
            <popover
                position={Gtk.PositionType.RIGHT}>
                <TrayContent vertical={false}/>
            </popover>
        }/>
}

function TrayContent({vertical}: { vertical: boolean }) {
    return <box
        vertical={vertical}
        visible={bind(tray, "items").as((items) => items.length > 0)}>
        {bind(tray, "items").as((items) => {
            return items.map((item) => {
                let ag_handler: number;

                return <menubutton
                    cssClasses={["trayMenuButton"]}
                    tooltipMarkup={bind(item, "tooltipMarkup")}
                    menuModel={bind(item, "menuModel")}
                    onDestroy={() => item.disconnect(ag_handler)}
                    setup={self => {
                        ag_handler = item.connect("notify::action-group", () => {
                            self.insert_action_group("dbusmenu", item.get_action_group())
                        })
                    }}>
                    <image gicon={bind(item, "gicon")}/>
                </menubutton>
            })
        })}
    </box>
}

function AppLauncherButton({vertical}: { vertical: boolean }) {
    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label="󰀻"
        onClicked={() => {
            toggleWindow(AppLauncherWindowName)
        }}/>
}

function ScreenshotButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label="󰹑"
        onClicked={() => {
            toggleWindow(ScreenshotWindowName)
        }}/>
}

function ClipboardManagerButton({vertical}: { vertical: boolean }) {
    execAsync(`${projectDir}/shellScripts/cliphistStore.sh`)
        .catch((error) => {
            console.error(error)
        })

    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label=""
        onClicked={() => {
            toggleWindow(ClipboardManagerWindowName)
        }}/>
}

function PowerProfileIndicator({vertical}: { vertical: boolean }) {
    const profiles = PowerProfiles.get_default().get_profiles()
    return <OkButton
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        visible={profiles.length !== 0}
        label={getPowerProfileIconBinding()}/>
}

function CavaBars({vertical}: { vertical: boolean }) {
    const mpris = Mpris.get_default()

    return <box>
        {mpris.players(players => {
            if (players.length === 0) {
                return <box/>
            }

            return <CavaWaveform
                marginStart={vertical ? 0 : 20}
                marginEnd={vertical ? 0 : 20}
                marginTop={vertical ? 20 : 0}
                marginBottom={vertical ? 20 : 0}
                vertical={vertical}
                flipStart={getCavaFlipStartValue(vertical)}
                intensity={vertical ? config.verticalBar.cava_waveform.intensityMultiplier : config.horizontalBar.cava_waveform.intensityMultiplier}
                expand={vertical ? config.verticalBar.cava_waveform.expanded : config.horizontalBar.cava_waveform.expanded}
                length={vertical ? config.verticalBar.cava_waveform.length : config.horizontalBar.cava_waveform.length}
                size={40}/>
        })}
    </box>
}

function MprisControls({vertical}: { vertical: boolean }) {
    const mpris = Mpris.get_default()
    return <box>
        {mpris.players(players => {
            const player = players.find((player) => player.isPrimaryPlayer)

            if (player === undefined) {
                return <box/>
            }

            return <MprisControlButtons player={player} vertical={vertical}/>
        })}
    </box>
}

function MprisTrackInfoBarWidget({vertical}: { vertical: boolean }) {
    const mpris = Mpris.get_default()
    return <box>
        {mpris.players(players => {
            const player = players.find((player) => player.isPrimaryPlayer)

            if (player === undefined) {
                return <box/>
            }

            return <MprisTrackInfo
                player={player}
                vertical={vertical}
                flipped={selectedBar().as((bar) => {
                    return bar === Bar.RIGHT
                })}/>
        })}
    </box>
}

function MprisPrimaryPlayerSwitcher({vertical}: { vertical: boolean }) {
    const mpris = Mpris.get_default()

    return <box>
        {mpris.players(players => {
            if (players.length <= 1) {
                return <box/>
            }

            return <OkButton
                offset={2}
                hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
                label=""
                onClicked={() => {
                    mpris.rotatePrimaryPlayer()
                }}/>
        })}
    </box>
}

function NotificationButton({vertical}: { vertical: boolean }) {
    const notifications = Notifd.get_default()

    const derivedNotificationState = Variable.derive([
        bind(notifications, "notifications"),
        bind(notifications, "dontDisturb")
    ])

    return <OkButton
        offset={1}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label={derivedNotificationState().as(([notificationsList, doNotDisturb]) => {
            if (doNotDisturb) {
                return "󰂛"
            } else if (notificationsList.length === 0) {
                return "󰂚"
            } else {
                return "󱅫"
            }
        })}
        onClicked={() => {
            toggleWindow(NotificationHistoryWindowName)
        }}/>
}

function ColorPickerButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label=""
        onClicked={() => {
            runColorPicker().catch((error) => console.log(error))
        }}/>
}

function LogoutButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label="󰍃"
        onClicked={() => {
            logout()
        }}/>
}

function LockButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label=""
        onClicked={() => {
            lock()
        }}/>
}

function RestartButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label=""
        onClicked={() => {
            restart()
        }}/>
}

function ShutdownButton({vertical}: { vertical: boolean }) {
    return <OkButton
        offset={2}
        hpadding={vertical ? OkButtonHorizontalPadding.STANDARD : OkButtonHorizontalPadding.THIN}
        label="⏻"
        onClicked={() => {
            shutdown()
        }}/>
}

export function addWidgets(widgets: BarWidget[], isVertical: boolean) {
    const schema = isVertical ? config.verticalBar : config.horizontalBar
    return widgets.map((widget) => {
        return <box
            marginTop={schema[widget].marginTop}
            marginBottom={schema[widget].marginBottom}
            marginStart={schema[widget].marginStart}
            marginEnd={schema[widget].marginEnd}>
            {getWidget(widget, isVertical)}
        </box>
    })
}

function getWidget(widget: BarWidget, isVertical: boolean) {
    switch (widget) {
        case BarWidget.MENU:
            return <MenuButton vertical={isVertical}/>
        case BarWidget.WORKSPACES:
            return <Workspaces vertical={isVertical}/>
        case BarWidget.BATTERY:
            return <BatteryIndicator vertical={isVertical}/>
        case BarWidget.AUDIO_IN:
            return <AudioIn vertical={isVertical}/>
        case BarWidget.AUDIO_OUT:
            return <AudioOut vertical={isVertical}/>
        case BarWidget.BLUETOOTH:
            return <BluetoothIndicator vertical={isVertical}/>
        case BarWidget.CLOCK:
            return <Clock vertical={isVertical}/>
        case BarWidget.NETWORK:
            return <NetworkIndicator vertical={isVertical}/>
        case BarWidget.RECORDING_INDICATOR:
            return <ScreenRecordingStopButton vertical={isVertical}/>
        case BarWidget.VPN_INDICATOR:
            return <VpnIndicator vertical={isVertical}/>
        case BarWidget.TRAY:
            return <TrayButton/>
        case BarWidget.INTEGRATED_TRAY:
            return <IntegratedTray vertical={isVertical}/>
        case BarWidget.APP_LAUNCHER:
            return <AppLauncherButton vertical={isVertical}/>
        case BarWidget.SCREENSHOT:
            return <ScreenshotButton vertical={isVertical}/>
        case BarWidget.CLIPBOARD_MANAGER:
            return <ClipboardManagerButton vertical={isVertical}/>
        case BarWidget.POWER_PROFILE:
            return <PowerProfileIndicator vertical={isVertical}/>
        case BarWidget.CAVA_WAVEFORM:
            return <CavaBars vertical={isVertical}/>
        case BarWidget.MPRIS_CONTROLS:
            return <MprisControls vertical={isVertical}/>
        case BarWidget.MPRIS_TRACK_INFO:
            return <MprisTrackInfoBarWidget vertical={isVertical}/>
        case BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER:
            return <MprisPrimaryPlayerSwitcher vertical={isVertical}/>
        case BarWidget.NOTIFICATION_HISTORY:
            return <NotificationButton vertical={isVertical}/>
        case BarWidget.COLOR_PICKER:
            return <ColorPickerButton vertical={isVertical}/>
        case BarWidget.LOCK:
            return <LockButton vertical={isVertical}/>
        case BarWidget.LOGOUT:
            return <LogoutButton vertical={isVertical}/>
        case BarWidget.RESTART:
            return <RestartButton vertical={isVertical}/>
        case BarWidget.SHUTDOWN:
            return <ShutdownButton vertical={isVertical}/>
    }
}
