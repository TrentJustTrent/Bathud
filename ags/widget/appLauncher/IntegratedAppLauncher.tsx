import {Astal, Gtk} from "ags/gtk4";
import {createState} from "ags";
import AppLauncher from "./AppLauncher";
import {frameWindow} from "../frame/Frame";

export const integratedAppLauncherWidth = 500

export const [integratedAppLauncherRevealed, integratedAppLauncherRevealedSetting] = createState(false)

export function toggleIntegratedAppLauncher() {
    integratedAppLauncherRevealedSetting(!integratedAppLauncherRevealed.get())
}

export default function () {
    integratedAppLauncherRevealed.subscribe(() => {
        if (integratedAppLauncherRevealed.get()) {
            (frameWindow as Astal.Window).keymode = Astal.Keymode.EXCLUSIVE
        } else {
            (frameWindow as Astal.Window).keymode = Astal.Keymode.NONE
        }
    })

    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedAppLauncherRevealed}>
        <AppLauncher/>
    </revealer>
}