import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import Verse from "./Verse";
import Timer from "./Timer";

export const integratedMiscWidth = 410

export const [integratedMiscRevealed, integratedMiscRevealedSetting] = createState(false)

export function toggleIntegratedMisc() {
    integratedMiscRevealedSetting(!integratedMiscRevealed.get())
}

export default function () {
    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedMiscRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={integratedMiscWidth}>
                <Verse/>
                <box marginTop={40}/>
                <Timer/>
            </box>
        </Gtk.ScrolledWindow>
    </revealer>
}