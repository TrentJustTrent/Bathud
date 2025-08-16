import {Astal, Gtk} from "ags/gtk4"
import App from "ags/gtk4/app"
import {addWidgets} from "./BarWidgets";
import {variableConfig} from "../../config/config";
import {Bar, selectedBar} from "../../config/bar";
import {createComputed, With} from "ags";

export const horizontalBarWindowName = "horizontalBar"

export default function () {
    const marginTop = createComputed([
        selectedBar.asAccessor(),
        variableConfig.horizontalBar.marginOuter.asAccessor(),
        variableConfig.horizontalBar.marginInner.asAccessor()
    ], (bar, outer, inner): number => {
        if (bar === Bar.TOP) {
            return outer
        } else {
            return inner
        }
    })

    const marginBottom = createComputed([
        selectedBar.asAccessor(),
        variableConfig.horizontalBar.marginOuter.asAccessor(),
        variableConfig.horizontalBar.marginInner.asAccessor()
    ], (bar, outer, inner): number => {
        if (bar === Bar.BOTTOM) {
            return outer
        } else {
            return inner
        }
    })

    const anchor = createComputed([
        selectedBar.asAccessor(),
        variableConfig.horizontalBar.expanded.asAccessor()
    ], (bar, expanded) => {
        if (bar === Bar.TOP) {
            if (!expanded) {
                return Astal.WindowAnchor.TOP
            }
            return Astal.WindowAnchor.TOP
                | Astal.WindowAnchor.LEFT
                | Astal.WindowAnchor.RIGHT
        } else {
            if (!expanded) {
                return Astal.WindowAnchor.BOTTOM
            }
            return Astal.WindowAnchor.BOTTOM
                | Astal.WindowAnchor.LEFT
                | Astal.WindowAnchor.RIGHT
        }
    })

    return <window
        defaultHeight={1} // necessary or resizing doesn't work
        name={horizontalBarWindowName}
        layer={Astal.Layer.TOP}
        namespace={"okpanel-horizontal-bar"}
        widthRequest={variableConfig.horizontalBar.minimumWidth.asAccessor()}
        visible={selectedBar.asAccessor()((bar) => {
            return bar === Bar.TOP || bar === Bar.BOTTOM
        })}
        cssClasses={["transparentBackground"]}
        monitor={variableConfig.mainMonitor.asAccessor()}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        // this window doesn't like marginStart for some reason
        marginLeft={variableConfig.horizontalBar.marginStart.asAccessor()}
        marginRight={variableConfig.horizontalBar.marginEnd.asAccessor()}
        marginTop={marginTop}
        marginBottom={marginBottom}
        anchor={anchor}
        application={App}>
        <centerbox
            orientation={Gtk.Orientation.HORIZONTAL}
            startWidget={
                <box
                    visible={variableConfig.horizontalBar.leftWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.START}
                    cssClasses={variableConfig.horizontalBar.splitSections.asAccessor().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <box
                        orientation={Gtk.Orientation.HORIZONTAL}
                        marginStart={variableConfig.horizontalBar.sectionPadding.asAccessor()}
                        marginEnd={variableConfig.horizontalBar.sectionPadding.asAccessor()}
                        spacing={variableConfig.horizontalBar.widgetSpacing.asAccessor()}>
                        <With value={variableConfig.horizontalBar.leftWidgets.asAccessor()}>
                            {widgets => <box orientation={Gtk.Orientation.HORIZONTAL}>
                                {addWidgets(widgets, false)}
                            </box>}
                        </With>
                    </box>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.horizontalBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    cssClasses={variableConfig.horizontalBar.splitSections.asAccessor().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <box
                        orientation={Gtk.Orientation.HORIZONTAL}
                        marginStart={variableConfig.horizontalBar.sectionPadding.asAccessor()}
                        marginEnd={variableConfig.horizontalBar.sectionPadding.asAccessor()}
                        spacing={variableConfig.horizontalBar.widgetSpacing.asAccessor()}>
                        <With value={variableConfig.horizontalBar.centerWidgets.asAccessor()}>
                            {widgets => <box orientation={Gtk.Orientation.HORIZONTAL}>
                                {addWidgets(widgets, false)}
                            </box>}
                        </With>
                    </box>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.horizontalBar.rightWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.END}
                    cssClasses={variableConfig.horizontalBar.splitSections.asAccessor().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <box
                        orientation={Gtk.Orientation.HORIZONTAL}
                        marginStart={variableConfig.horizontalBar.sectionPadding.asAccessor()}
                        marginEnd={variableConfig.horizontalBar.sectionPadding.asAccessor()}
                        spacing={variableConfig.horizontalBar.widgetSpacing.asAccessor()}>
                        <With value={variableConfig.horizontalBar.rightWidgets.asAccessor()}>
                            {widgets => <box orientation={Gtk.Orientation.HORIZONTAL}>
                                {addWidgets(widgets, false)}
                            </box>}
                        </With>
                    </box>
                </box> as Gtk.Widget
            }/>
    </window>
}
