import {Gtk} from "astal/gtk4"
import {execAsync} from "astal/process"
import {config} from "../../config/config";
import LargeIconButton from "../common/LargeIconButton";
import {hideAllWindows} from "../utils/windows";

export default function () {
    return <box
        vertical={false}
        halign={Gtk.Align.CENTER}
        spacing={12}>
        <LargeIconButton
            icon="󰍃"
            offset={0}
            onClicked={() => {
                hideAllWindows()
                execAsync(config.systemCommands.logout)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
        <LargeIconButton
            icon=""
            offset={2}
            onClicked={() => {
                hideAllWindows()
                execAsync(config.systemCommands.lock)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
        <LargeIconButton
            icon=""
            offset={0}
            onClicked={() => {
                hideAllWindows()
                execAsync(config.systemCommands.restart)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
        <LargeIconButton
            icon="⏻"
            offset={2}
            onClicked={() => {
                hideAllWindows()
                execAsync(config.systemCommands.shutdown)
                    .catch((error) => {
                        console.error(error)
                    })
            }}/>
    </box>
}