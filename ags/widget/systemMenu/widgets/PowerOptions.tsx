import {Gtk} from "ags/gtk4"
import OkButton, {OkButtonSize} from "../../common/OkButton";
import {lock, logout, restart, shutdown} from "../../utils/powerOptions";

export default function () {
    return <box
        orientation={Gtk.Orientation.HORIZONTAL}
        halign={Gtk.Align.CENTER}
        spacing={12}>
        <OkButton
            size={OkButtonSize.XL}
            label="󰍃"
            offset={0}
            onClicked={() => {
                logout()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={2}
            onClicked={() => {
                lock()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={0}
            onClicked={() => {
                restart()
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label="⏻"
            offset={2}
            onClicked={() => {
                shutdown()
            }}/>
    </box>
}