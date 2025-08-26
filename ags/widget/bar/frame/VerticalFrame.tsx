import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {Bar, selectedBar} from "../../../config/bar";
import {integratedMenuRevealed, integratedMenuWidth} from "../IntegratedMenu";
import {verticalBarWidth} from "../VerticalBar";

export enum Side {
    LEFT,
    RIGHT
}

export default function (
    {
        side,
    }: {
        side: Side,
    }
): Astal.Window {
    const thisSideBar = side === Side.LEFT ? Bar.LEFT : Bar.RIGHT
    const anchor = side === Side.LEFT ?
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT :
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT

    const size = createComputed([
        selectedBar.asAccessor(),
        verticalBarWidth,
        variableConfig.theme.bars.frameThickness.asAccessor(),
        variableConfig.verticalBar.marginInner.asAccessor(),
        variableConfig.theme.bars.borderWidth.asAccessor(),
    ], (
        bar,
        barWidth,
        frameThickness,
        marginInner,
        borderWidth,
    ) => {
        if (bar === thisSideBar) {
            return barWidth + marginInner + borderWidth
        }
        return frameThickness + borderWidth + marginInner
    })

    return <window
        defaultWidth={1} // necessary or resizing doesn't work
        cssClasses={["mostlyTransparentBackground"]}
        layer={Astal.Layer.BACKGROUND}
        namespace={"okpanel-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}
        visible={true}
        application={App}
        canTarget={false}
        canFocus={false}
        $={(self) => {
            self.get_native()?.get_surface()?.set_input_region(new Cairo.Region())
        }}>
        <box
            vexpand={true}
            hexpand={true}>
            {/*Represents the bar*/}
            <box
                widthRequest={size}/>
            {/*Represents integrated menu*/}
            <revealer
                visible={selectedBar.asAccessor().as((bar) => {
                    return bar === thisSideBar
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedMenuRevealed}>
                <box
                    widthRequest={integratedMenuWidth}/>
            </revealer>
        </box>
    </window> as Astal.Window
}