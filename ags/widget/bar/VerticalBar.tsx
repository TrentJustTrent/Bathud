import {addWidgets} from "./BarWidgets";
import {variableConfig} from "../../config/config";
import {Gtk} from "ags/gtk4";
import {createState, With} from "ags"
import {interval} from "ags/time";

export const [verticalBarWidth, verticalBarWidthSetter] = createState(0)

export default function ({setup}: {setup: (self: Gtk.Widget) => void}) {
    // wrapped in a box for the padding (margins of the center box)
    return <box
        $={(self) => {
            setup(self)

            interval(1000, () => {
                verticalBarWidthSetter(self.get_allocated_width())
            })
            verticalBarWidthSetter(self.get_allocated_width())
        }}>
        <centerbox
            marginTop={2}
            marginBottom={2}
            marginStart={2}
            marginEnd={2}
            hexpand={false}
            heightRequest={variableConfig.verticalBar.minimumHeight.asAccessor()}
            orientation={Gtk.Orientation.VERTICAL}
            startWidget={
                <box
                    visible={variableConfig.verticalBar.topWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}
                    cssClasses={variableConfig.verticalBar.splitSections.asAccessor().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <With value={variableConfig.verticalBar.topWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            marginTop={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            marginBottom={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            spacing={variableConfig.verticalBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, true)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.verticalBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}
                    cssClasses={variableConfig.verticalBar.splitSections.asAccessor().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <With value={variableConfig.verticalBar.centerWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            marginTop={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            marginBottom={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            spacing={variableConfig.verticalBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, true)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.verticalBar.bottomWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}
                    valign={Gtk.Align.END}
                    cssClasses={variableConfig.verticalBar.splitSections.asAccessor().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <With value={variableConfig.verticalBar.bottomWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            marginTop={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            marginBottom={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            spacing={variableConfig.verticalBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, true)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }/>
    </box>
}
