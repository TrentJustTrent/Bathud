import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import Screenshot, {updateScreenshotAudioOptions} from "./Screenshot";

export const integratedScreenshotWidth = 564

export const [integratedScreenshotRevealed, integratedScreenshotRevealedSetting] = createState(false)

export function toggleIntegratedScreenshot() {
    integratedScreenshotRevealedSetting(!integratedScreenshotRevealed.get())
}

export default function () {
    integratedScreenshotRevealed.subscribe(() => {
        if (integratedScreenshotRevealed.get()) {
            updateScreenshotAudioOptions()
        }
    })

    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedScreenshotRevealed}>
        <box
            hexpand={false}
            widthRequest={integratedScreenshotWidth}>
            <box
                marginTop={20}
                marginBottom={20}
                marginStart={20}
                marginEnd={20}>
                <Screenshot/>
            </box>

        </box>
    </revealer>
}