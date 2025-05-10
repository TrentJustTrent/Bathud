import {Gtk} from "astal/gtk4"
import Pango from "gi://Pango?version=1.0";
import RevealerRow from "../../common/RevealerRow";
import {SystemMenuWindowName} from "../SystemMenuWindow";
import OkButton, {OkButtonSize} from "../../common/OkButton";
import {execAsync} from "astal/process";
import {hideAllWindows} from "../../utils/windows";

function showColorPickerNotification(
    color: string
) {
    execAsync([
        "bash",
        "-c",
        `
            ACTION_VIEW="viewScreenshot"
            ACTION_OPEN_DIR="openDir"
            # Send a notification with an action to view the file
            notify-send "Copied color ${color} to clipboard" \
                --app-name="Color Picker"
        `
    ]).catch((error) => {
        console.error(error)
    }).then((value) => {
        console.log(value)
    })
}

function runColorPicker() {
    hideAllWindows()
    execAsync('hyprpicker')
        .catch((error) => {
            console.error(error)
        }).then((value) => {
            console.log(value)
            if (typeof value !== "string") {
                return
            }
            execAsync([
                "bash",
                "-c",
                `wl-copy "${value}"`
            ]).catch((error) => {
                console.error(error)
            }).finally(() => {
                showColorPickerNotification(value)
            })
        })
}

function ColorPicker() {
    return <box>
        <OkButton
            label=""
            size={OkButtonSize.XL}
            onClicked={() => {
                runColorPicker()
            }}/>
    </box>
}

export default function () {
    return <RevealerRow
        icon="󰭆"
        iconOffset={0}
        windowName={SystemMenuWindowName}
        content={
            <label
                cssClasses={["labelMediumBold"]}
                halign={Gtk.Align.START}
                hexpand={true}
                ellipsize={Pango.EllipsizeMode.END}
                label="Gizmos"/>
        }
        revealedContent={
            <box
                marginTop={10}
                vertical={true}>
                <ColorPicker/>
            </box>
        }
    />
}