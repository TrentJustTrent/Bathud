import {addWidgets} from "../../barWidgets/BarWidgets";
import {variableConfig} from "../../../config/config";
import {Gtk} from "ags/gtk4";
import {createState, With} from "ags"
import {interval} from "ags/time";
import {Bar} from "../../../config/bar";

export const [leftBarWidth, leftBarWidthSetter] = createState(0)

export default function () {
    // wrapped in a box for the padding (margins of the center box)
    return <box
        $={(self) => {
            interval(1000, () => {
                leftBarWidthSetter(self.get_allocated_width())
            })
            leftBarWidthSetter(self.get_allocated_width())
        }}
        cssClasses={["leftBar"]}>
        <centerbox
            marginTop={2}
            marginBottom={2}
            marginStart={2}
            marginEnd={2}
            hexpand={false}
            orientation={Gtk.Orientation.VERTICAL}
            startWidget={
                <box
                    visible={variableConfig.leftBar.topWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <With value={variableConfig.leftBar.topWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={variableConfig.leftBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.LEFT)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.leftBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <With value={variableConfig.leftBar.centerWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={variableConfig.leftBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.LEFT)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.leftBar.bottomWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}
                    valign={Gtk.Align.END}>
                    <With value={variableConfig.leftBar.bottomWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={variableConfig.leftBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.LEFT)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }/>
    </box>
}
