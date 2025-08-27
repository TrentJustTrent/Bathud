import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {integratedMenuRevealed, integratedMenuWidth} from "../../systemMenu/IntegratedMenu";
import {leftBarWidth} from "../bars/LeftBar";
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
import {Position} from "../../../config/schema/definitions/frame";

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
    const anchor = side === Side.LEFT ?
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT :
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT

    const size = createComputed([
        leftBarWidth,
        rightBarWidth,
        variableConfig.frame.leftThickness.asAccessor(),
        variableConfig.frame.rightThickness.asAccessor(),
        variableConfig.frame.borderWidth.asAccessor(),
    ], (
        leftBarWidth,
        rightBarWidth,
        leftThickness,
        rightThickness,
        borderWidth,
    ) => {
        if (side === Side.LEFT) {
            return leftThickness + leftBarWidth + borderWidth
        }
        return rightThickness + rightBarWidth + borderWidth
    })

    return <window
        defaultWidth={1} // necessary or resizing doesn't work
        cssClasses={["mostlyTransparentBackground"]}
        layer={Astal.Layer.BACKGROUND}
        namespace={"okpanel-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={anchor}
        marginLeft={side === Side.RIGHT ? variableConfig.frame.margin.asAccessor() : 0}
        marginRight={side === Side.LEFT ? variableConfig.frame.margin.asAccessor() : 0}
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
                visible={variableConfig.frame.menuPosition.asAccessor().as((position) => {
                    if (side === Side.LEFT) {
                        return position === Position.LEFT
                    } else {
                        return position === Position.RIGHT
                    }
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedMenuRevealed}>
                <box
                    widthRequest={integratedMenuWidth}/>
            </revealer>
            {/*Represents integrated calendar*/}
            <revealer
                visible={variableConfig.frame.calendarPosition.asAccessor().as((position) => {
                    if (side === Side.LEFT) {
                        return position === Position.LEFT
                    } else {
                        return position === Position.RIGHT
                    }
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedCalendarRevealed}>
                <box
                    widthRequest={integratedCalendarWidth}/>
            </revealer>
            {/*Represents integrated clipboard manager*/}
            <revealer
                visible={variableConfig.frame.clipboardManagerPosition.asAccessor().as((position) => {
                    if (side === Side.LEFT) {
                        return position === Position.LEFT
                    } else {
                        return position === Position.RIGHT
                    }
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedClipboardManagerRevealed}>
                <box
                    widthRequest={integratedClipboardManagerWidth}/>
            </revealer>
            {/*Represents integrated notification history*/}
            <revealer
                visible={variableConfig.frame.notificationsPosition.asAccessor().as((position) => {
                    if (side === Side.LEFT) {
                        return position === Position.LEFT
                    } else {
                        return position === Position.RIGHT
                    }
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedNotificationHistoryRevealed}>
                <box
                    widthRequest={integratedNotificationHistoryWidth}/>
            </revealer>
        </box>
    </window> as Astal.Window
}