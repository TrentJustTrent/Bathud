import {Gtk} from "astal/gtk4"
import Pango from "gi://Pango?version=1.0";
import RevealerRow from "../../common/RevealerRow";
import {SystemMenuWindowName} from "../SystemMenuWindow";
import OkButton, {OkButtonSize} from "../../common/OkButton";
import {execAsync} from "astal/process";
import {hideAllWindows, toggleWindow} from "../../utils/windows";
import {sleep} from "../../utils/async";
import {ScreenshotWindowName} from "../../screenshot/Screenshot";

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

async function runColorPicker() {
    hideAllWindows()
    await sleep(500)
    execAsync('hyprpicker').catch((error) => {
        console.error(error)
    }).then((value) => {
        console.log(value)
        if (typeof value !== "string") {
            return
        }
        const match = value.match(/#[0-9A-Fa-f]{6,8}/);

        const color = match ? match[0] : null
        if (color === null) {
            return
        }

        execAsync([
            "bash",
            "-c",
            `nohup wl-copy "${color}" >/dev/null 2>&1 &`
        ]).catch((error) => {
            console.error(error)
        }).finally(() => {
            showColorPickerNotification(color)
        })
    })
}

function ColorPicker() {
    return <box>
        <OkButton
            offset={2}
            primary={true}
            label=""
            size={OkButtonSize.XL}
            onClicked={() => {
                runColorPicker().catch((error) => console.log(error))
            }}/>
    </box>
}

function ScreenShotGizmo() {
    return <box>
        <OkButton
            offset={4}
            primary={true}
            label="󰹑"
            size={OkButtonSize.XL}
            onClicked={() => {
                hideAllWindows()
                toggleWindow(ScreenshotWindowName)
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
                vertical={false}
                spacing={10}
                halign={Gtk.Align.CENTER}>
                <ColorPicker/>
                <ScreenShotGizmo/>
            </box>
        }
    />
}