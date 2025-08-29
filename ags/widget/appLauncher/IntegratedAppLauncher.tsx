import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import AppLauncher from "./AppLauncher";

export const integratedAppLauncherWidth = 500

export const [integratedAppLauncherRevealed, integratedAppLauncherRevealedSetting] = createState(false)

export function toggleIntegratedAppLauncher() {
    integratedAppLauncherRevealedSetting(!integratedAppLauncherRevealed.get())
}

export default function () {
    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedAppLauncherRevealed}>
        <AppLauncher/>
    </revealer>
}