import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import ClipboardManager from "./ClipboardManager";
import {applyStyleChangeFix} from "../utils/styleFix";

export const integratedClipboardManagerWidth = 410

export const [integratedClipboardManagerRevealed, integratedClipboardManagerRevealedSetting] = createState(false)

export function toggleIntegratedClipboardManager() {
    integratedClipboardManagerRevealedSetting(!integratedClipboardManagerRevealed.get())
}

export default function () {
    return <revealer
        $={(self) => {
            applyStyleChangeFix(self, integratedClipboardManagerRevealed)
        }}
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedClipboardManagerRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={integratedClipboardManagerWidth}>
            <ClipboardManager/>
        </Gtk.ScrolledWindow>
    </revealer>
}