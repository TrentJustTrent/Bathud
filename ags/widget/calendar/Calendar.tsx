import {Astal, Gtk} from "ags/gtk4"
import {variableConfig} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {Bar, selectedBar} from "../../config/bar";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import GLib from "gi://GLib?version=2.0";
import {createPoll} from "../../../../../../../usr/share/ags/js/lib/time";
import {createComputed} from "ags";

export const CalendarWindowName = "calendarWindow"

export default function (): Astal.Window {
    const time = createPoll<GLib.DateTime>(
        GLib.DateTime.new_now_local(),
        1000,
        () => GLib.DateTime.new_now_local()
    )

    const topExpand = createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.centerWidgets.asAccessor(),
        variableConfig.verticalBar.bottomWidgets.asAccessor(),
    ], (bar, center, bottom) => {
        switch (bar) {
            case Bar.BOTTOM:
                return true
            case Bar.LEFT:
            case Bar.RIGHT:
                return center.includes(BarWidget.CLOCK)
                    || bottom.includes(BarWidget.CLOCK)
            default: return false
        }
    })

    const bottomExpand = createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.centerWidgets.asAccessor(),
        variableConfig.verticalBar.topWidgets.asAccessor(),
    ], (bar, center, top) => {
        switch (bar) {
            case Bar.TOP:
                return true
            case Bar.LEFT:
            case Bar.RIGHT:
                return center.includes(BarWidget.CLOCK)
                    || top.includes(BarWidget.CLOCK)
            default: return false
        }
    })

    const leftExpand = createComputed([
        selectedBar.asAccessor(),
        variableConfig.horizontalBar.centerWidgets.asAccessor(),
        variableConfig.horizontalBar.rightWidgets.asAccessor(),
    ], (bar, center, right) => {
        switch (bar) {
            case Bar.RIGHT:
                return true
            case Bar.TOP:
            case Bar.BOTTOM:
                return center.includes(BarWidget.CLOCK)
                    || right.includes(BarWidget.CLOCK)
            default: return false
        }
    })

    const rightExpand = createComputed([
        selectedBar.asAccessor(),
        variableConfig.horizontalBar.centerWidgets.asAccessor(),
        variableConfig.horizontalBar.leftWidgets.asAccessor(),
    ], (bar, center, left) => {
        switch (bar) {
            case Bar.LEFT:
                return true
            case Bar.TOP:
            case Bar.BOTTOM:
                return center.includes(BarWidget.CLOCK)
                    || left.includes(BarWidget.CLOCK)
            default: return false
        }
    })

    return <ScrimScrollWindow
        namespace={"okpanel-calendar"}
        monitor={variableConfig.mainMonitor.asAccessor()}
        windowName={CalendarWindowName}
        topExpand={topExpand}
        bottomExpand={bottomExpand}
        leftExpand={leftExpand}
        rightExpand={rightExpand}
        contentWidth={340}
        visible={true}
        content={
            <box
                cssClasses={["calendarBox"]}
                orientation={Gtk.Orientation.VERTICAL}>
                <label
                    cssClasses={["labelMedium"]}
                    label={time.as((t) => {
                        return t.format("%A")!
                    })}/>
                <label
                    cssClasses={["labelMedium"]}
                    label={time.as((t) => {
                        return t.format("%B %-d, %Y")!
                    })}/>
                <Gtk.Calendar
                    marginTop={12}
                    cssClasses={["calendar"]}/>
            </box>
        }/> as Astal.Window
}