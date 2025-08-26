import {Astal} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {Bar, selectedBar} from "../../../config/bar";
import {horizontalBarHeight} from "../HorizontalBar";

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
    const oppositeSideBar = side === Side.TOP ? Bar.BOTTOM : Bar.TOP
    const anchor = side === Side.TOP ?
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT :
        Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.LEFT

    const visible = createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.enableFrame.asAccessor(),
        variableConfig.horizontalBar.enableFrame.asAccessor(),
    ], (bar, enabledVert, enabledHor) => {
        if (bar === thisSideBar) return true
        if (bar === oppositeSideBar) {
            return enabledHor
        }
        return enabledVert
    })

    const size = createComputed([
        selectedBar.asAccessor(),
        horizontalBarHeight,
        variableConfig.horizontalBar.enableFrame.asAccessor(),
        variableConfig.theme.bars.frameThickness.asAccessor(),
        variableConfig.horizontalBar.marginOuter.asAccessor(),
        variableConfig.horizontalBar.marginInner.asAccessor(),
        variableConfig.theme.bars.borderWidth.asAccessor(),
    ], (
        selectedBar,
        barHeight,
        enableFrame,
        frameThickness,
        marginOuter,
        marginInner,
        borderWidth,
    ) => {
        if (selectedBar === thisSideBar) {
            if (enableFrame) {
                return barHeight + marginInner + borderWidth
            } else {
                return barHeight + marginOuter + marginInner
            }
        }
        return enableFrame ? frameThickness + borderWidth + marginInner : 0
    })

    return <window
        defaultHeight={1} // necessary or resizing doesn't work
        cssClasses={["mostlyTransparentBackground"]}
        layer={Astal.Layer.BACKGROUND}
        namespace={"okpanel-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}
        visible={visible}
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