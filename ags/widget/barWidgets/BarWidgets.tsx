import Hyprland from "gi://AstalHyprland"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"
import {getMicrophoneIcon, getVolumeIcon, playBatteryWarning} from "../utils/audio"
import {getNetworkIconBinding} from "../utils/network"
import {getBatteryIcon} from "../utils/battery"
import Bluetooth from "gi://AstalBluetooth"
import {activeVpnConnections} from "../systemMenu/widgets/NetworkControls";
import {isRecording, ScreenshotWindowName} from "../screenshot/Screenshot";
import Divider from "../common/Divider";
import {variableConfig} from "../../config/config";
import Tray from "gi://AstalTray"
import {toggleWindow} from "../utils/windows";
import {AppLauncherWindowName} from "../appLauncher/AppLauncher";
import {startCliphist} from "../clipboardManager/ClipboardManager";
import PowerProfiles from "gi://AstalPowerProfiles"
import {getPowerProfileIconBinding} from "../utils/powerProfile";
import CavaWaveform from "../cava/CavaWaveform";
import {getCavaFlipStartValue} from "../utils/cava";
import {Mpris} from "../utils/mpris";
import MprisControlButtons from "../mpris/MprisControlButtons";
import MprisTrackInfo from "../mpris/MprisTrackInfo";
import {Bar, selectedBar} from "../../config/bar";
import Notifd from "gi://AstalNotifd"
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import Gtk from "gi://Gtk?version=4.0";
import OkButton, {OkButtonHorizontalPadding, OkButtonSize, OkButtonVerticalPadding} from "../common/OkButton";
import {createBinding, createComputed, createState, For, With} from "ags";
import {createPoll} from "../../../../../../../usr/share/ags/js/lib/time";
import GLib from "gi://GLib?version=2.0";
import {runColorPicker} from "../utils/colorPicker";
import {lock, logout, restart, shutdown} from "../utils/powerOptions";
import {execAsync} from "ags/process";
import {integratedMenuRevealed, integratedMenuRevealedSetting} from "../systemMenu/IntegratedMenu";
import {toggleIntegratedCalendar} from "../calendar/IntegratedCalendar";
import {toggleIntegratedClipboardManager} from "../clipboardManager/IntegratedClipboardManager";
import {toggleIntegratedNotificationHistory} from "../notification/IntegratedNotificationHistory";

const tray = Tray.get_default()

export function getHPadding(bar: Bar) {
    switch (bar) {
        case Bar.TOP:
        case Bar.BOTTOM:
            return OkButtonHorizontalPadding.THIN
        case Bar.LEFT:
            return variableConfig.leftBar.compact.asAccessor().as((c) =>
                c ? OkButtonHorizontalPadding.THIN : OkButtonHorizontalPadding.STANDARD)
        case Bar.RIGHT:
            return variableConfig.rightBar.compact.asAccessor().as((c) =>
                c ? OkButtonHorizontalPadding.THIN : OkButtonHorizontalPadding.STANDARD)
    }
}

export function getVPadding(bar: Bar) {
    switch (bar) {
        case Bar.TOP:
            return variableConfig.topBar.compact.asAccessor().as((c) =>
                c ? OkButtonVerticalPadding.THIN : OkButtonVerticalPadding.STANDARD)
        case Bar.BOTTOM:
            return variableConfig.bottomBar.compact.asAccessor().as((c) =>
                c ? OkButtonVerticalPadding.THIN : OkButtonVerticalPadding.STANDARD)
        case Bar.LEFT:
        case Bar.RIGHT:
            return OkButtonVerticalPadding.STANDARD
    }
}

function MenuButton({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barMenuForeground"]}
        backgroundCss={["barMenuBackground"]}
        offset={variableConfig.theme.bars.menu.iconOffset.asAccessor()}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={variableConfig.theme.bars.menu.icon.asAccessor()}
        onClicked={() => {
            integratedMenuRevealedSetting(!integratedMenuRevealed.get())
        }}/>
}

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

function Workspaces({vertical, bar}: { vertical: boolean, bar: Bar }) {
    const hypr = Hyprland.get_default()
    const hyprlandWorkspaces = createBinding(hypr, "workspaces")
    return <box
        cssClasses={["barWorkspacesBackground", "radiusSmall"]}
        orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}>
        <With value={hyprlandWorkspaces}>
            {(workspaces) => {
                const groupedWorkspaces = groupByProperty(workspaces)
                return <box>
                    {groupedWorkspaces.map((workspaceGroup, index) => {
                        return <box
                            orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}>
                            {index > 0 && index < groupedWorkspaces.length &&
                                <Divider
                                    thin={true}
                                    marginStart={4}
                                    marginEnd={4}/>
                            }
                            {workspaceGroup.sort((a, b) => {
                                return a.id - b.id
                            }).map((workspace: Hyprland.Workspace) => {
                                let labelCss = createComputed([
                                    createBinding(workspace.monitor, "activeWorkspace"),
                                ], (w: Hyprland.Workspace) => {
                                    const isActive = w?.id === workspace.id
                                    return isActive ? ["barWorkspacesForeground"] : ["barWorkspacesInactiveForeground"]
                                })

                                let offset = createComputed([
                                    createBinding(workspace.monitor, "activeWorkspace"),
                                    variableConfig.theme.bars.workspaces.activeOffset.asAccessor(),
                                    variableConfig.theme.bars.workspaces.inactiveOffset.asAccessor()
                                ], (w: Hyprland.Workspace, activeOffset, inactiveOffset) => {
                                    const isActive = w?.id === workspace.id
                                    return isActive ? activeOffset : inactiveOffset
                                })

                                let label = createComputed([
                                    createBinding(workspace.monitor, "activeWorkspace"),
                                    variableConfig.theme.bars.workspaces.activeIcon.asAccessor(),
                                    variableConfig.theme.bars.workspaces.inactiveIcon.asAccessor()
                                ], (w: Hyprland.Workspace, activeIcon, inactiveIcon) => {
                                    const isActive = w?.id === workspace.id
                                    return isActive ? activeIcon : inactiveIcon
                                })

                                let size = createComputed([
                                    createBinding(workspace.monitor, "activeWorkspace"),
                                    variableConfig.theme.bars.workspaces.largeActive.asAccessor()
                                ], (w: Hyprland.Workspace, isLarge) => {
                                    const isActive = w?.id === workspace.id
                                    return isActive && isLarge ? OkButtonSize.LARGE : OkButtonSize.SMALL
                                })

                                return <OkButton
                                    labelCss={labelCss.get()}
                                    backgroundCss={["barWorkspaceButtonBackground"]}
                                    offset={offset}
                                    hpadding={getHPadding(bar)}
                                    vpadding={getVPadding(bar)}
                                    label={label}
                                    size={size}
                                    onClicked={() => {
                                        hypr.dispatch("workspace", `${workspace.id}`)
                                    }}/>
                            })}
                        </box>
                    })}
                </box>
            }}
        </With>
    </box>
}

function Clock({vertical, bar}: { vertical: boolean, bar: Bar }) {
    let format: string

    if (vertical) {
        format = "%I\n%M"
    } else {
        format = "%I:%M"
    }

    const time = createPoll("", 1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <OkButton
        labelCss={["barClockForeground"]}
        backgroundCss={["barClockBackground"]}
        hexpand={vertical}
        hpadding={vertical ? OkButtonHorizontalPadding.NONE : OkButtonHorizontalPadding.THIN}
        vpadding={getVPadding(bar)}
        label={time}
        onClicked={() => {
            toggleIntegratedCalendar()
        }}/>
}

function VpnIndicator({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barVpnIndicatorForeground"]}
        backgroundCss={["barVpnIndicatorBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="󰯄"
        visible={activeVpnConnections.as((connections) => {
            return connections.length !== 0
        })}/>
}

function ScreenRecordingStopButton({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barRecordingIndicatorForeground"]}
        backgroundCss={["barRecordingIndicatorBackground"]}
        offset={2}
        warning={true}
        label=""
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        visible={isRecording}
        onClicked={() => {
            execAsync("pkill wf-recorder")
                .catch((error) => {
                    console.error(error)
                })
        }}/>
}

function AudioOut({bar}: { bar: Bar }) {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker

    const speakerVar = createComputed([
        createBinding(defaultSpeaker, "description"),
        createBinding(defaultSpeaker, "volume"),
        createBinding(defaultSpeaker, "mute")
    ])

    return <OkButton
        labelCss={["barAudioOutForeground"]}
        backgroundCss={["barAudioOutBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={speakerVar(() => getVolumeIcon(defaultSpeaker))}/>
}

function AudioIn({bar}: { bar: Bar }) {
    const {defaultMicrophone} = Wp.get_default()!.audio

    const micVar = createComputed([
        createBinding(defaultMicrophone, "description"),
        createBinding(defaultMicrophone, "volume"),
        createBinding(defaultMicrophone, "mute")
    ])

    return <OkButton
        labelCss={["barAudioInForeground"]}
        backgroundCss={["barAudioInBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={micVar(() => getMicrophoneIcon(defaultMicrophone))}/>
}

function BluetoothIndicator({bar}: { bar: Bar }) {
    const bluetooth = Bluetooth.get_default()

    return <OkButton
        labelCss={["barBluetoothForeground"]}
        backgroundCss={["barBluetoothBackground"]}
        label="󰂯"
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        visible={createBinding(bluetooth, "isPowered").as((isPowered) => {
            return isPowered
        })}/>
}

function NetworkIndicator({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barNetworkForeground"]}
        backgroundCss={["barNetworkBackground"]}
        offset={1}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={getNetworkIconBinding()}/>
}

function BatteryIndicator({bar}: { bar: Bar }) {
    const battery = Battery.get_default()

    let batteryWarningInterval: GLib.Source | null = null

    const batteryVar = createComputed([
        createBinding(battery, "percentage"),
        createBinding(battery, "state")
    ])

    return <OkButton
        labelCss={["barBatteryForeground"]}
        backgroundCss={["barBatteryBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
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
        visible={createBinding(battery, "isBattery")}/>
}

function IntegratedTray({vertical, bar}: { vertical: boolean, bar: Bar }) {
    let collapsable
    switch (bar) {
        case Bar.TOP:
            collapsable = variableConfig.topBar.tray.collapsable.asAccessor()
            break
        case Bar.BOTTOM:
            collapsable = variableConfig.bottomBar.tray.collapsable.asAccessor()
            break
        case Bar.LEFT:
            collapsable = variableConfig.leftBar.tray.collapsable.asAccessor()
            break
        case Bar.RIGHT:
            collapsable = variableConfig.rightBar.tray.collapsable.asAccessor()
            break
    }

    return <box>
        <With value={collapsable}>
            {(collapse) => {
                if (collapse) {
                    const [revealed, revealedSetter] = createState(false)
                    return <box
                        orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}>
                        <revealer
                            revealChild={revealed}>
                            <TrayContent vertical={vertical}/>
                        </revealer>
                        <OkButton
                            labelCss={["barTrayForeground"]}
                            backgroundCss={["barTrayBackground"]}
                            hpadding={getHPadding(bar)}
                            vpadding={getVPadding(bar)}
                            offset={1}
                            visible={createBinding(tray, "items").as((items) => items.length > 0)}
                            label={"󱊔"}
                            onClicked={() => {
                                revealedSetter(!revealed.get())
                            }}/>
                    </box>
                } else {
                    return <TrayContent vertical={vertical}/>
                }
            }}
        </With>
    </box>
}

function TrayContent({vertical}: { vertical: boolean }) {
    return <box
        orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}
        visible={createBinding(tray, "items").as((items) => items.length > 0)}>
        <For each={createBinding(tray, "items")}>
            {(item: Tray.TrayItem) => {
                if (item.id === null) {
                    return <box/>
                }
                let ag_handler: number;

                const menuButton = <menubutton
                    cssClasses={["trayMenuButton"]}
                    tooltipMarkup={createBinding(item, "tooltipMarkup")}
                    menuModel={createBinding(item, "menuModel")}
                    onDestroy={() => item.disconnect(ag_handler)}
                    $={self => {
                        ag_handler = item.connect("notify::action-group", () => {
                            self.insert_action_group("dbusmenu", item.get_action_group())
                        })
                    }}>
                    <image gicon={createBinding(item, "gicon")}/>
                </menubutton> as Gtk.MenuButton

                menuButton.insert_action_group("dbusmenu", item.get_action_group())

                return menuButton
            }}
        </For>
    </box>
}

function AppLauncherButton({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barAppLauncherForeground"]}
        backgroundCss={["barAppLauncherBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="󰀻"
        onClicked={() => {
            toggleWindow(AppLauncherWindowName)
        }}/>
}

function ScreenshotButton({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barScreenshotForeground"]}
        backgroundCss={["barScreenshotBackground"]}
        offset={2}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="󰹑"
        onClicked={() => {
            toggleWindow(ScreenshotWindowName)
        }}/>
}

function ClipboardManagerButton({bar}: { bar: Bar }) {
    startCliphist()
    return <OkButton
        labelCss={["barClipboardManagerForeground"]}
        backgroundCss={["barClipboardManagerBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label=""
        onClicked={() => {
            toggleIntegratedClipboardManager()
        }}/>
}

function PowerProfileIndicator({bar}: { bar: Bar }) {
    const profiles = PowerProfiles.get_default().get_profiles()
    return <OkButton
        labelCss={["barPowerProfileForeground"]}
        backgroundCss={["barPowerProfileBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        visible={profiles.length !== 0}
        label={getPowerProfileIconBinding()}/>
}

function CavaBars({vertical, bar}: { vertical: boolean, bar: Bar }) {
    const mpris = Mpris.get_default()

    return <box
        vexpand={!vertical}
        hexpand={vertical}
        cssClasses={["barCavaWaveformBackground", "radiusSmall"]}>
        <With value={mpris.players[0]}>
            {(players => {
                if (players.length === 0) {
                    return <box/>
                }

                let intensity
                let expand
                let length

                switch (bar) {
                    case Bar.TOP:
                        intensity = variableConfig.topBar.cava_waveform.intensityMultiplier.asAccessor()
                        expand = variableConfig.topBar.cava_waveform.expanded.asAccessor()
                        length = variableConfig.topBar.cava_waveform.length.asAccessor()
                        break
                    case Bar.BOTTOM:
                        intensity = variableConfig.bottomBar.cava_waveform.intensityMultiplier.asAccessor()
                        expand = variableConfig.bottomBar.cava_waveform.expanded.asAccessor()
                        length = variableConfig.bottomBar.cava_waveform.length.asAccessor()
                        break
                    case Bar.LEFT:
                        intensity = variableConfig.leftBar.cava_waveform.intensityMultiplier.asAccessor()
                        expand = variableConfig.leftBar.cava_waveform.expanded.asAccessor()
                        length = variableConfig.leftBar.cava_waveform.length.asAccessor()
                        break
                    case Bar.RIGHT:
                        intensity = variableConfig.rightBar.cava_waveform.intensityMultiplier.asAccessor()
                        expand = variableConfig.rightBar.cava_waveform.expanded.asAccessor()
                        length = variableConfig.rightBar.cava_waveform.length.asAccessor()
                        break
                }

                return <box
                    vexpand={!vertical}
                    hexpand={vertical}>
                    <CavaWaveform
                        color={variableConfig.theme.bars.cava_waveform.foreground.asAccessor()}
                        marginStart={vertical ? 0 : 20}
                        marginEnd={vertical ? 0 : 20}
                        marginTop={vertical ? 20 : 0}
                        marginBottom={vertical ? 20 : 0}
                        vertical={vertical}
                        flipStart={getCavaFlipStartValue(bar)}
                        intensity={intensity}
                        expand={expand}
                        length={length}
                        size={30}/>
                </box>
            })}
        </With>
    </box>
}

function MprisControls({vertical}: { vertical: boolean }) {
    const mpris = Mpris.get_default()
    return <box
        cssClasses={["barMprisControlsBackground", "radiusSmall"]}>
        <With value={mpris.players[0]}>
            {(players) => {
                const player = players.find((player) => player.isPrimaryPlayer)

                if (player === undefined) {
                    return <box/>
                }

                return <MprisControlButtons
                    player={player}
                    vertical={vertical}
                    foregroundCss={["barMprisControlsForeground"]}
                    backgroundCss={["barMprisControlsButtonBackground"]}/>
            }}
        </With>
    </box>
}

function MprisTrackInfoBarWidget({vertical, bar}: { vertical: boolean, bar: Bar }) {
    const mpris = Mpris.get_default()
    return <box
        cssClasses={["barMprisTrackInfoBackground", "radiusSmall"]}>
        <With value={mpris.players[0]}>
            {(players) => {
                const player = players.find((player) => player.isPrimaryPlayer)

                if (player === undefined) {
                    return <box/>
                }

                let compact

                switch (bar) {
                    case Bar.TOP:
                        compact = variableConfig.topBar.compact.asAccessor()
                        break
                    case Bar.BOTTOM:
                        compact = variableConfig.bottomBar.compact.asAccessor()
                        break
                    case Bar.LEFT:
                        compact = variableConfig.leftBar.compact.asAccessor()
                        break
                    case Bar.RIGHT:
                        compact = variableConfig.rightBar.compact.asAccessor()
                        break
                }

                return <MprisTrackInfo
                    compact={compact}
                    player={player}
                    vertical={vertical}
                    flipped={selectedBar.asAccessor().as((bar) => {
                        return bar === Bar.RIGHT
                    })}/>
            }}
        </With>
    </box>
}

function MprisPrimaryPlayerSwitcher({ bar}: { bar: Bar }) {
    const mpris = Mpris.get_default()

    return <box>
        <With value={mpris.players[0]}>
            {(players) => {
                if (players.length <= 1) {
                    return <box/>
                }

                return <OkButton
                    labelCss={["barMprisPrimaryPlayerSwitcherForeground"]}
                    backgroundCss={["barMprisPrimaryPlayerSwitcherBackground"]}
                    offset={2}
                    hpadding={getHPadding(bar)}
                    vpadding={getVPadding(bar)}
                    label=""
                    onClicked={() => {
                        mpris.rotatePrimaryPlayer()
                    }}/>
            }}
        </With>
    </box>
}

function NotificationButton({ bar}: { bar: Bar }) {
    const notifications = Notifd.get_default()

    const notificationIcon = createComputed([
        createBinding(notifications, "dontDisturb")
    ], (doNotDisturb) => {
        if (doNotDisturb) {
            return "󰂛"
        } else{
            return "󰂚"
        }
    })

    const notificationIconOffset = createComputed([
        createBinding(notifications, "dontDisturb")
    ], (doNotDisturb) => {
        if (doNotDisturb) {
            return 2
        } else{
            return 1
        }
    })

    const visible = createComputed([
        createBinding(notifications, "notifications")
    ], (notificationsList) => {
        return notificationsList.length > 0
    })

    return <overlay
        $={(self) => {
            self.add_overlay(
                <box
                    canTarget={false}
                    canFocus={false}
                    hexpand={false}
                    vexpand={false}
                    visible={visible}
                    cssClasses={["notificationIndicator"]}
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    widthRequest={7}
                    heightRequest={7}
                    marginStart={6}
                    marginBottom={6}
                /> as Gtk.Box
            )
        }}>
        <OkButton
            labelCss={["barNotificationHistoryForeground"]}
            backgroundCss={["barNotificationHistoryBackground"]}
            offset={notificationIconOffset}
            hpadding={getHPadding(bar)}
            vpadding={getVPadding(bar)}
            label={notificationIcon}
            onClicked={() => {
                toggleIntegratedNotificationHistory()
            }}/>
    </overlay>
}

function ColorPickerButton({ bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barColorPickerForeground"]}
        backgroundCss={["barColorPickerBackground"]}
        offset={2}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label=""
        onClicked={() => {
            runColorPicker().catch((error) => console.log(error))
        }}/>
}

function LogoutButton({ bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barLogoutForeground"]}
        backgroundCss={["barLogoutBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="󰍃"
        onClicked={() => {
            logout()
        }}/>
}

function LockButton({ bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barLockForeground"]}
        backgroundCss={["barLockBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label=""
        onClicked={() => {
            lock()
        }}/>
}

function RestartButton({ bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barRestartForeground"]}
        backgroundCss={["barRestartBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label=""
        onClicked={() => {
            restart()
        }}/>
}

function ShutdownButton({ bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barShutdownForeground"]}
        backgroundCss={["barShutdownBackground"]}
        offset={1}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="⏻"
        onClicked={() => {
            shutdown()
        }}/>
}

export function addWidgets(widgets: BarWidget[], bar: Bar) {
    let schema
    let isVertical
    switch (bar) {
        case Bar.TOP:
            schema = variableConfig.topBar
            isVertical = false
            break
        case Bar.BOTTOM:
            schema = variableConfig.bottomBar
            isVertical = false
            break
        case Bar.LEFT:
            schema = variableConfig.leftBar
            isVertical = true
            break
        case Bar.RIGHT:
            schema = variableConfig.rightBar
            isVertical = true
            break
    }
    return widgets.map((widget) => {
        return <box
            marginTop={schema[widget].marginTop.asAccessor()}
            marginBottom={schema[widget].marginBottom.asAccessor()}
            marginStart={schema[widget].marginStart.asAccessor()}
            marginEnd={schema[widget].marginEnd.asAccessor()}>
            {getWidget(widget, isVertical, bar)}
        </box>
    })
}

function getWidget(widget: BarWidget, isVertical: boolean, bar: Bar) {
    switch (widget) {
        case BarWidget.MENU:
            return <MenuButton bar={bar}/>
        case BarWidget.WORKSPACES:
            return <Workspaces bar={bar} vertical={isVertical}/>
        case BarWidget.CLOCK:
            return <Clock bar={bar} vertical={isVertical}/>
        case BarWidget.AUDIO_OUT:
            return <AudioOut bar={bar}/>
        case BarWidget.AUDIO_IN:
            return <AudioIn bar={bar}/>
        case BarWidget.BLUETOOTH:
            return <BluetoothIndicator bar={bar}/>
        case BarWidget.NETWORK:
            return <NetworkIndicator bar={bar}/>
        case BarWidget.BATTERY:
            return <BatteryIndicator bar={bar}/>
        case BarWidget.TRAY:
            return <IntegratedTray bar={bar} vertical={isVertical}/>
        case BarWidget.APP_LAUNCHER:
            return <AppLauncherButton bar={bar}/>
        case BarWidget.SCREENSHOT:
            return <ScreenshotButton bar={bar}/>
        case BarWidget.CLIPBOARD_MANAGER:
            return <ClipboardManagerButton bar={bar}/>
        case BarWidget.POWER_PROFILE:
            return <PowerProfileIndicator bar={bar}/>
        case BarWidget.LOCK:
            return <LockButton bar={bar}/>
        case BarWidget.LOGOUT:
            return <LogoutButton bar={bar}/>
        case BarWidget.RESTART:
            return <RestartButton bar={bar}/>
        case BarWidget.SHUTDOWN:
            return <ShutdownButton bar={bar}/>
        case BarWidget.CAVA_WAVEFORM:
            return <CavaBars bar={bar} vertical={isVertical}/>
        case BarWidget.VPN_INDICATOR:
            return <VpnIndicator bar={bar}/>
        case BarWidget.RECORDING_INDICATOR:
            return <ScreenRecordingStopButton bar={bar}/>
        case BarWidget.MPRIS_CONTROLS:
            return <MprisControls vertical={isVertical}/>
        case BarWidget.MPRIS_TRACK_INFO:
            return <MprisTrackInfoBarWidget bar={bar} vertical={isVertical}/>
        case BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER:
            return <MprisPrimaryPlayerSwitcher bar={bar}/>
        case BarWidget.NOTIFICATION_HISTORY:
            return <NotificationButton bar={bar}/>
        case BarWidget.COLOR_PICKER:
            return <ColorPickerButton bar={bar}/>
    }
}
