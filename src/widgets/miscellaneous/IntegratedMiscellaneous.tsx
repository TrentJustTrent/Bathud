import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import Verse from "./Verse";
import Timer from "./Timer";

export const IntegratedMiscWidth = 410

export const [IntegratedMiscRevealed, IntegratedMiscRevealedSetting] = createState(false)

export function toggleIntegratedMiscellaneous() {
    IntegratedMiscRevealedSetting(!IntegratedMiscRevealed.peek())
}

export function closeIntegratedMiscellaneous() {
    IntegratedMiscRevealedSetting(false)
}

export default function () {
    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={IntegratedMiscRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={IntegratedMiscWidth}>
            <box
                hexpand={false}
                orientation={Gtk.Orientation.VERTICAL}>
                <Verse/>
                <box marginTop={40}/>
                <Timer/>
            </box>
        </Gtk.ScrolledWindow>
    </revealer>
}