import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import Screenshare from "./Screenshare";

export const integratedScreenshareWidth = 410

export const [integratedScreenshareRevealed, integratedScreenshareRevealedSetting] = createState(false)

export function toggleIntegratedScreenshare() {
    integratedScreenshareRevealedSetting(!integratedScreenshareRevealed.get())
}

export default function () {
    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedScreenshareRevealed}>
        <box
            hexpand={false}
            orientation={Gtk.Orientation.VERTICAL}
            widthRequest={integratedScreenshareWidth}>
            <Screenshare/>
        </box>
    </revealer>
}