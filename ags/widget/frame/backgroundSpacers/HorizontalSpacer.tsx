import {Astal} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {topBarHeight} from "../bars/TopBar";
import {bottomBarHeight} from "../bars/BottomBar";

export enum Side {
    TOP,
    BOTTOM
}

export default function (
    {
        side,
    }: {
        side: Side,
    }
): Astal.Window {
    const anchor = side === Side.TOP ?
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT :
        Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT

    const size = createComputed([
        topBarHeight,
        bottomBarHeight,
        variableConfig.frame.bottomThickness.asAccessor(),
        variableConfig.frame.topThickness.asAccessor(),
        variableConfig.frame.borderWidth.asAccessor(),
    ], (
        topBarHeight,
        bottomBarHeight,
        bottomThickness,
        topThickness,
        borderWidth,
    ) => {
        if (side === Side.TOP) {
            return topThickness + topBarHeight + borderWidth
        }
        return bottomThickness + bottomBarHeight + borderWidth
    })

    return <window
        defaultHeight={1} // necessary or resizing doesn't work
        cssClasses={["mostlyTransparentBackground"]}
        layer={Astal.Layer.BACKGROUND}
        namespace={"okpanel-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}
        marginTop={side === Side.BOTTOM ? variableConfig.frame.margin.asAccessor() : 0}
        marginBottom={side === Side.TOP ? variableConfig.frame.margin.asAccessor() : 0}
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
                heightRequest={size}/>
        </box>
    </window> as Astal.Window
}