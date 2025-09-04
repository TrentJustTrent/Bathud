import {Gtk} from "ags/gtk4"
import Pango from "gi://Pango?version=1.0";
import RevealerRow from "../../common/RevealerRow";
import OkButton, {OkButtonSize} from "../../common/OkButton";
import {runColorPicker} from "../../utils/colorPicker";
import {toggleIntegratedScreenshot} from "../../screenshot/IntegratedScreenshot";
import {integratedMenuRevealed} from "../IntegratedMenu";

function ColorPicker() {
    return <box>
        <OkButton
            offset={2}
            label=""
            size={OkButtonSize.XL}
            onClicked={() => {
                runColorPicker(500).catch((error) => console.log(error))
            }}/>
    </box>
}

function ScreenShotGizmo() {
    return <box>
        <OkButton
            offset={4}
            label="󰹑"
            size={OkButtonSize.XL}
            onClicked={() => {
                toggleIntegratedScreenshot()
            }}/>
    </box>
}

export default function () {
    return <RevealerRow
        setup={(revealed) => {
            integratedMenuRevealed.subscribe(() => {
                if (!integratedMenuRevealed.get()) {
                    revealed[1](false)
                }
            })
        }}
        icon=""
        iconOffset={0}
        content={
            <label
                cssClasses={["labelMediumBold"]}
                halign={Gtk.Align.START}
                hexpand={true}
                ellipsize={Pango.EllipsizeMode.END}
                label="Toolbox"/>
        }
        revealedContent={
            <box
                marginTop={10}
                orientation={Gtk.Orientation.HORIZONTAL}
                spacing={10}
                halign={Gtk.Align.CENTER}>
                <ColorPicker/>
                <ScreenShotGizmo/>
            </box>
        }
    />
}