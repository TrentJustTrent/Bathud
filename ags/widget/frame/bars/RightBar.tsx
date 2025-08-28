import {addWidgets} from "../../barWidgets/BarWidgets";
import {variableConfig} from "../../../config/config";
import {Gtk} from "ags/gtk4";
import {createState, With} from "ags"
import {interval} from "ags/time";
import {Bar} from "../../../config/bar";

export const [rightBarWidth, rightBarWidthSetter] = createState(0)

export default function () {
    // wrapped in a box for the padding (margins of the center box)
    return <box
        $={(self) => {
            interval(1000, () => {
                rightBarWidthSetter(self.get_allocated_width())
            })
            rightBarWidthSetter(self.get_allocated_width())
        }}
        marginTop={variableConfig.rightBar.marginTop.asAccessor()}
        marginBottom={variableConfig.rightBar.marginBottom.asAccessor()}
        marginStart={variableConfig.rightBar.marginStart.asAccessor()}
        marginEnd={variableConfig.rightBar.marginEnd.asAccessor()}>
        <centerbox
            hexpand={false}
            orientation={Gtk.Orientation.VERTICAL}
            startWidget={
                <box
                    visible={variableConfig.rightBar.topWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <With value={variableConfig.rightBar.topWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={variableConfig.rightBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.RIGHT)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.rightBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <With value={variableConfig.rightBar.centerWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={variableConfig.rightBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.RIGHT)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.rightBar.bottomWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    orientation={Gtk.Orientation.VERTICAL}
                    valign={Gtk.Align.END}>
                    <With value={variableConfig.rightBar.bottomWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={variableConfig.rightBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.RIGHT)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }/>
    </box>
}
