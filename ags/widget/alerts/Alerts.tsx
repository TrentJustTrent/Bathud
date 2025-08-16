import App from "ags/gtk4/app"
import {Accessor, createBinding, createComputed} from "ags"
import Wp from "gi://AstalWp"
import {getVolumeIcon, playPowerPlug, playPowerUnplug} from "../utils/audio";
import Brightness from "../utils/connectables/brightness";
import {getBrightnessIcon} from "../utils/brightness";
import Battery from "gi://AstalBattery"
import Hyprland from "gi://AstalHyprland"
import GLib from "gi://GLib?version=2.0";
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";

const VolumeAlertName = "volumeAlert"
const BrightnessAlertName = "brightnessAlert"

export function AlertWindow(
    {
        iconLabel,
        label,
        sliderValue,
        windowName,
        showVariable,
        monitor
    }: {
        iconLabel: Accessor<string>,
        label: string,
        sliderValue: Accessor<number>,
        windowName: string,
        showVariable: Accessor<any>
        monitor: Hyprland.Monitor
    }
): Astal.Window {
    let windowVisibilityTimeout: GLib.Source | null = null

    //@ts-ignore
    return <window
        namespace={"okpanel-alerts"}
        monitor={monitor.id}
        name={windowName}
        application={App}
        anchor={Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        cssClasses={["window"]}
        margin_bottom={100}
        visible={false}
        $={(self: Astal.Window) => {
            let canShow = false
            setTimeout(() => {
                canShow = true
            }, 3_000)
            showVariable.subscribe(() => {
                if (!canShow) {
                    return
                }
                if (windowVisibilityTimeout != null) {
                    windowVisibilityTimeout.destroy()
                }
                self.visible = true
                windowVisibilityTimeout = setTimeout(() => {
                    self.visible = false
                    windowVisibilityTimeout?.destroy()
                    windowVisibilityTimeout = null
                }, 1_000)
            })
        }}>
        <box
            orientation={Gtk.Orientation.HORIZONTAL}
            marginBottom={18}
            marginTop={18}
            marginStart={5}
            marginEnd={5}
            halign={Gtk.Align.CENTER}>
            <label
                marginStart={20}
                marginEnd={15}
                cssClasses={["alertIcon"]}
                label={iconLabel}/>
            <box
                orientation={Gtk.Orientation.VERTICAL}
                marginStart={10}
                valign={Gtk.Align.CENTER}>
                <label
                    cssClasses={["labelSmall"]}
                    label={label}
                    halign={Gtk.Align.START}/>
                <slider
                    marginTop={2}
                    marginEnd={20}
                    class="alertProgress"
                    hexpand={true}
                    value={sliderValue}/>
            </box>
        </box>
    </window> as Astal.Window
}

export function VolumeAlert(monitor: Hyprland.Monitor): Astal.Window {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker

    const speakerVar = createComputed([
        createBinding(defaultSpeaker, "description"),
        createBinding(defaultSpeaker, "volume"),
        createBinding(defaultSpeaker, "mute")
    ])

    const showVariable = createComputed([
        createBinding(defaultSpeaker, "volume"),
        createBinding(defaultSpeaker, "mute")
    ])

    return <AlertWindow
        iconLabel={speakerVar(() => getVolumeIcon(defaultSpeaker))}
        label="Volume"
        sliderValue={createBinding(defaultSpeaker, "volume")}
        windowName={VolumeAlertName}
        showVariable={showVariable}
        monitor={monitor}/> as Astal.Window
}

export function BrightnessAlert(monitor: Hyprland.Monitor): Astal.Window {
    const brightness = Brightness.get_default()

    const showVariable = createComputed([
        createBinding(brightness, "screen")
    ])

    return <AlertWindow
        iconLabel={createBinding(brightness, "screen").as(() => {
            return getBrightnessIcon(brightness)
        })}
        label="Brightness"
        sliderValue={createBinding(brightness, "screen")}
        windowName={BrightnessAlertName}
        showVariable={showVariable}
        monitor={monitor}/> as  Astal.Window
}

export function ChargingAlertSound() {
    const linePowerDevice = Battery
        .UPower
        .new()
        .devices
        .find((device) => {
            return device.deviceType === Battery.Type.LINE_POWER &&
                (device.nativePath.includes("ACAD") ||
                device.nativePath.includes("ACPI") ||
                device.nativePath.includes("AC") ||
                device.nativePath.includes("ADP"))
        })

    if (linePowerDevice !== null && linePowerDevice !== undefined) {
        createBinding(linePowerDevice, "online").subscribe(() => {
            if (linePowerDevice.online) {
                playPowerPlug()
            } else {
                playPowerUnplug()
            }
        })
    }
}