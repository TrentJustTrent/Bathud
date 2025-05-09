import {Gtk} from "astal/gtk4"
import {execAsync} from "astal/process"
import {config} from "../../config/config";
import {hideAllWindows} from "../utils/windows";
import {cleanup} from "../../app";
import OkButton, {OkButtonSize} from "../common/OkButton";

export default function () {
    return <box
        vertical={false}
        halign={Gtk.Align.CENTER}
        spacing={12}>
        <OkButton
            size={OkButtonSize.XL}
            label="󰍃"
            offset={0}
            onClicked={() => {
                cleanup()
                hideAllWindows()
                execAsync(config.systemCommands.logout)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={2}
            onClicked={() => {
                hideAllWindows()
                execAsync(config.systemCommands.lock)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={0}
            onClicked={() => {
                cleanup()
                hideAllWindows()
                execAsync(config.systemCommands.restart)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label="⏻"
            offset={2}
            onClicked={() => {
                cleanup()
                hideAllWindows()
                execAsync(config.systemCommands.shutdown)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
    </box>
}