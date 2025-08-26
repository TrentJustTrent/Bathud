import {Astal} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {Bar, selectedBar} from "../../../config/bar";
import {topBarHeight} from "../TopBar";
import {bottomBarHeight} from "../BottomBar";

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
    const thisSideBar = side === Side.TOP ? Bar.TOP : Bar.BOTTOM
    const anchor = side === Side.TOP ?
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT :
        Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT

    const size = createComputed([
        variableConfig.topBar.enabled.asAccessor(),
        variableConfig.bottomBar.enabled.asAccessor(),
        topBarHeight,
        bottomBarHeight,
        variableConfig.theme.bars.frameThickness.asAccessor(),
        variableConfig.frame.margin.asAccessor(),
        variableConfig.theme.bars.borderWidth.asAccessor(),
    ], (
        topEnabled,
        bottomEnabled,
        topBarHeight,
        bottomBarHeight,
        frameThickness,
        marginInner,
        borderWidth,
    ) => {
        if (thisSideBar === Bar.TOP && topEnabled) {
            return topBarHeight + marginInner + borderWidth
        }
        if (thisSideBar === Bar.BOTTOM && bottomEnabled) {
            return bottomBarHeight + marginInner + borderWidth
        }
        return frameThickness + borderWidth + marginInner
    })

    return <window
        defaultHeight={1} // necessary or resizing doesn't work
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
                heightRequest={size}/>
        </box>
    </window> as Astal.Window
}