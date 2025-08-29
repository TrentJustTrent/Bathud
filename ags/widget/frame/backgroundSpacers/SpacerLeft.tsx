import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {integratedMenuRevealed, integratedMenuWidth} from "../../systemMenu/IntegratedMenu";
import {leftBarWidth} from "../bars/LeftBar";
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
import {integratedScreenshotRevealed, integratedScreenshotWidth} from "../../screenshot/IntegratedScreenshot";
import {integratedAppLauncherRevealed, integratedAppLauncherWidth} from "../../appLauncher/IntegratedAppLauncher";

export default function (): Astal.Window {
    const size = createComputed([
        leftBarWidth,
        variableConfig.frame.leftThickness.asAccessor(),
        variableConfig.frame.borderWidth.asAccessor(),
        variableConfig.leftBar.marginStart.asAccessor(),
        variableConfig.leftBar.marginEnd.asAccessor(),
        variableConfig.frame.leftGroup.marginStart.asAccessor(),
        variableConfig.frame.leftGroup.marginEnd.asAccessor(),
        variableConfig.frame.leftGroup.paddingStart.asAccessor(),
        variableConfig.frame.leftGroup.paddingEnd.asAccessor(),
        variableConfig.frame.leftGroup.borderWidth.asAccessor(),
        variableConfig.frame.margin.asAccessor(),
    ], (
        leftBarWidth,
        leftThickness,
        borderWidth,
        barMarginStart,
        barMarginEnd,
        groupMarginStart,
        groupMarginEnd,
        groupPaddingStart,
        groupPaddingEnd,
        groupBorderWidth,
        frameMargin,
    ) => {
        return leftThickness + leftBarWidth + borderWidth + barMarginStart +
            barMarginEnd + groupMarginStart + groupMarginEnd + groupPaddingStart +
            groupPaddingEnd + (groupBorderWidth * 2) + frameMargin
    })

    return <window
        defaultWidth={1} // necessary or resizing doesn't work
        cssClasses={["mostlyTransparentBackground"]}
        layer={Astal.Layer.BACKGROUND}
        namespace={"okpanel-frame-spacer"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
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
                    return position === Position.LEFT
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedMenuRevealed}>
                <box
                    widthRequest={integratedMenuWidth}/>
            </revealer>
            {/*Represents integrated calendar*/}
            <revealer
                visible={variableConfig.frame.calendarPosition.asAccessor().as((position) => {
                    return position === Position.LEFT
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedCalendarRevealed}>
                <box
                    widthRequest={integratedCalendarWidth}/>
            </revealer>
            {/*Represents integrated clipboard manager*/}
            <revealer
                visible={variableConfig.frame.clipboardManagerPosition.asAccessor().as((position) => {
                    return position === Position.LEFT
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedClipboardManagerRevealed}>
                <box
                    widthRequest={integratedClipboardManagerWidth}/>
            </revealer>
            {/*Represents integrated notification history*/}
            <revealer
                visible={variableConfig.frame.notificationsPosition.asAccessor().as((position) => {
                    return position === Position.LEFT
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedNotificationHistoryRevealed}>
                <box
                    widthRequest={integratedNotificationHistoryWidth}/>
            </revealer>
            {/*Represents integrated screenshot tool*/}
            <revealer
                visible={variableConfig.frame.screenshotToolPosition.asAccessor().as((position) => {
                    return position === Position.LEFT
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedScreenshotRevealed}>
                <box
                    widthRequest={integratedScreenshotWidth}/>
            </revealer>
            {/*Represents integrated app launcher*/}
            <revealer
                visible={variableConfig.frame.appLauncherPosition.asAccessor().as((position) => {
                    return position === Position.LEFT
                })}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                revealChild={integratedAppLauncherRevealed}>
                <box
                    widthRequest={integratedAppLauncherWidth}/>
            </revealer>
        </box>
    </window> as Astal.Window
}