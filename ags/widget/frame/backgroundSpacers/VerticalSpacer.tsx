import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {Bar} from "../../../config/bar";
import {integratedMenuRevealed, integratedMenuWidth} from "../../systemMenu/IntegratedMenu";
import {leftBarWidth} from "../bars/LeftBar";
import {Position} from "../../../config/schema/definitions/systemMenu";
import {rightBarWidth} from "../bars/RightBar";
import {integratedCalendarRevealed, integratedCalendarWidth} from "../../calendar/IntegratedCalendar";
import {
    integratedClipboardManagerRevealed,
    integratedClipboardManagerWidth
} from "../../clipboardManager/IntegratedClipboardManager";
import {
    integratedNotificationHistoryRevealed,
    integratedNotificationHistoryWidth
} from "../../notification/IntegratedNotificationHistory";

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
        variableConfig.leftBar.enabled.asAccessor(),
        variableConfig.rightBar.enabled.asAccessor(),
        leftBarWidth,
        rightBarWidth,
        variableConfig.theme.bars.frameThickness.asAccessor(),
        variableConfig.frame.margin.asAccessor(),
        variableConfig.theme.bars.borderWidth.asAccessor(),
    ], (
        leftEnabled,
        rightEnabled,
        leftBarWidth,
        rightBarWidth,
        frameThickness,
        marginInner,
        borderWidth,
    ) => {
        if (thisSideBar === Bar.LEFT && leftEnabled) {
            return leftBarWidth + marginInner + borderWidth
        }
        if (thisSideBar === Bar.RIGHT && rightEnabled) {
            return rightBarWidth + marginInner + borderWidth
        }
        return frameThickness + borderWidth + marginInner
    })

    let visible
    switch (side) {
        case Side.RIGHT:
            visible = variableConfig.systemMenu.position.asAccessor().as((p) => p === Position.RIGHT)
            break
        case Side.LEFT:
            visible = variableConfig.systemMenu.position.asAccessor().as((p) => p === Position.LEFT)
            break
    }

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
        canFocus={false}>
        <box
            vexpand={true}
            hexpand={true}>
            {/*Represents the bar*/}
            <box
                widthRequest={size}/>
            {/*Represents integrated menu*/}
            <revealer
                visible={visible}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedMenuRevealed}>
                <box
                    widthRequest={integratedMenuWidth}/>
            </revealer>
            {/*Represents integrated calendar*/}
            <revealer
                visible={visible}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedCalendarRevealed}>
                <box
                    widthRequest={integratedCalendarWidth}/>
            </revealer>
            {/*Represents integrated clipboard manager*/}
            <revealer
                visible={visible}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedClipboardManagerRevealed}>
                <box
                    widthRequest={integratedClipboardManagerWidth}/>
            </revealer>
            {/*Represents integrated notification history*/}
            <revealer
                visible={visible}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedNotificationHistoryRevealed}>
                <box
                    widthRequest={integratedNotificationHistoryWidth}/>
            </revealer>
        </box>
    </window> as Astal.Window
}