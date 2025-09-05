import {Gtk} from "ags/gtk4";
import OkButton, {OkButtonSize} from "../../common/OkButton";
import AstalBluetooth from "gi://AstalBluetooth";
import {createBinding, createState} from "ags";
import {airplaneModeEnabled, disableAirplaneMode, enableAirplaneMode} from "./NetworkControls";
import {execAsync} from "ags/process";
import {variableConfig} from "../../../config/config";
import AstalNotifd from "gi://AstalNotifd";
import {integratedAppLauncherRevealed, toggleIntegratedAppLauncher} from "../../appLauncher/IntegratedAppLauncher";
import {
    integratedClipboardManagerRevealed,
    toggleIntegratedClipboardManager
} from "../../clipboardManager/IntegratedClipboardManager";
import {runColorPicker} from "../../utils/colorPicker";
import {integratedScreenshotRevealed, toggleIntegratedScreenshot} from "../../screenshot/IntegratedScreenshot";

export const [nightLightEnabled, nightLightEnabledSet] = createState(false)

export function enableNightLight() {
    execAsync(`hyprctl hyprsunset temperature ${variableConfig.theme.nightLightTemperature}`)
        .catch((error) => {
            console.error(error)
        }).then(() => {
        nightLightEnabledSet(true)
    })
}

export function disableNightLight() {
    execAsync("hyprctl hyprsunset identity")
        .catch((error) => {
            console.error(error)
        }).then(() => {
        nightLightEnabledSet(false)
    })
}

function RowOne() {
    const bluetooth = AstalBluetooth.get_default()
    const notifications = AstalNotifd.get_default()

    return <box
        spacing={12}
        halign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.HORIZONTAL}>
        <OkButton
            size={OkButtonSize.XL}
            label={createBinding(bluetooth, "isPowered").as((powered) =>
                powered ? "󰂯" : "󰂲"
            )}
            offset={0}
            selected={createBinding(bluetooth, "isPowered")}
            onClicked={() => {
                bluetooth.toggle()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label="󰀝"
            offset={0}
            selected={airplaneModeEnabled}
            onClicked={() => {
                if (airplaneModeEnabled.get()) {
                    disableAirplaneMode()
                } else {
                    enableAirplaneMode()
                }
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label="󱩌"
            offset={0}
            selected={nightLightEnabled}
            onClicked={() => {
                if (nightLightEnabled.get()) {
                    disableNightLight()
                } else {
                    enableNightLight()
                }
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label={createBinding(notifications, "dontDisturb").as((dnd) => {
                return dnd ? "󰂛" : "󰂚"
            })}
            offset={createBinding(notifications, "dontDisturb").as((dnd) => {
                return dnd ? 3 : 1
            })}
            selected={createBinding(notifications, "dontDisturb")}
            onClicked={() => {
                notifications.set_dont_disturb(!notifications.dontDisturb)
            }}/>
    </box>
}

function RowTwo() {
    return <box
        spacing={12}
        halign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.HORIZONTAL}>
        <OkButton
            size={OkButtonSize.XL}
            label="󰀻"
            offset={0}
            selected={integratedAppLauncherRevealed}
            onClicked={() => {
                toggleIntegratedAppLauncher()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={1}
            selected={integratedClipboardManagerRevealed}
            onClicked={() => {
                toggleIntegratedClipboardManager()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label="󰹑"
            offset={3}
            selected={integratedScreenshotRevealed}
            onClicked={() => {
                toggleIntegratedScreenshot()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={2}
            onClicked={() => {
                runColorPicker(500).catch((error) => console.log(error))
            }}/>
    </box>
}

export default function () {
    return <box
        spacing={12}
        halign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.VERTICAL}>
        <RowOne/>
        <RowTwo/>
    </box>
}