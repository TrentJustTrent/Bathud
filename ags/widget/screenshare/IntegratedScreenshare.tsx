import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import Screenshare from "./Screenshare";
import {applyStyleChangeFix} from "../utils/styleFix";

export const integratedScreenshareWidth = 410

export const [integratedScreenshareRevealed, integratedScreenshareRevealedSetting] = createState(false)

export function toggleIntegratedScreenshare() {
    integratedScreenshareRevealedSetting(!integratedScreenshareRevealed.get())
}

export default function () {
    return <revealer
        $={(self) => {
            applyStyleChangeFix(self, integratedScreenshareRevealed)
        }}
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedScreenshareRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={integratedScreenshareWidth}>
            <Screenshare/>
        </Gtk.ScrolledWindow>
    </revealer>
}