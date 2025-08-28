import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import ClipboardManager, {updateClipboardEntries} from "./ClipboardManager";
import AstalIO from "gi://AstalIO?version=0.1";
import {interval} from "ags/time";

export const integratedClipboardManagerWidth = 410

export const [integratedClipboardManagerRevealed, integratedClipboardManagerRevealedSetting] = createState(false)

export function toggleIntegratedClipboardManager() {
    integratedClipboardManagerRevealedSetting(!integratedClipboardManagerRevealed.get())
}

export default function () {
    let updateInterval: AstalIO.Time | null = null

    integratedClipboardManagerRevealed.subscribe(() => {
        if (integratedClipboardManagerRevealed.get()) {
            updateInterval = interval(5000, () => {
                updateClipboardEntries()
            })
        } else {
            updateInterval?.cancel()
            updateInterval = null
        }
    })

    return <revealer
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