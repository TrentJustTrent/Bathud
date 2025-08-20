import {Gtk} from "ags/gtk4"
import Pango from "gi://Pango?version=1.0";
import RevealerRow from "../../common/RevealerRow";
import {SystemMenuWindowName} from "../SystemMenuWindow";
import {ClipboardManagerContent, updateClipboardEntries} from "../../clipboardManager/ClipboardManager";
import {interval} from "ags/time";
import AstalIO from "gi://AstalIO?version=0.1";

export default function () {

    let updateInterval: AstalIO.Time | null = null

    return <RevealerRow
        icon={""}
        iconOffset={0}
        windowName={SystemMenuWindowName}
        content={
            <label
                cssClasses={["labelMediumBold"]}
                halign={Gtk.Align.START}
                hexpand={true}
                ellipsize={Pango.EllipsizeMode.END}
                label={"Clipboard Manager"}/>
        }
        revealedContent={
            <box
                marginTop={8}>
                <ClipboardManagerContent/>
            </box>
        }
        setup={(revealed) => {
            revealed[0].subscribe(() => {
                if (revealed[0].get()) {
                    updateInterval = interval(5000, () => {
                        updateClipboardEntries()
                    })
                } else {
                    updateInterval?.cancel()
                    updateInterval = null
                }
            })
        }}
    />
}