import {Gtk} from "ags/gtk4"
import {addWidgets} from "../../barWidgets/BarWidgets";
import {variableConfig} from "../../../config/config";
import {createState, With} from "ags";
import {interval} from "ags/time";
import {Bar} from "../../../config/bar";

export const [bottomBarHeight, bottomBarHeightSetter] = createState(0)

export default function () {

    // wrapped in a box for the padding (margins of the center box)
    return <box
        $={(self) => {
            interval(1000, () => {
                bottomBarHeightSetter(self.get_allocated_height())
            })
            bottomBarHeightSetter(self.get_allocated_height())
        }}
        marginTop={variableConfig.bottomBar.marginTop.asAccessor()}
        marginBottom={variableConfig.bottomBar.marginBottom.asAccessor()}
        marginStart={variableConfig.bottomBar.marginStart.asAccessor()}
        marginEnd={variableConfig.bottomBar.marginEnd.asAccessor()}
        cssClasses={["bottomBar"]}>
        <centerbox
            marginTop={2}
            marginBottom={2}
            marginStart={2}
            marginEnd={2}
            hexpand={true}
            orientation={Gtk.Orientation.HORIZONTAL}
            startWidget={
                <box
                    visible={variableConfig.bottomBar.leftWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.START}>
                    <With value={variableConfig.bottomBar.leftWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.bottomBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.BOTTOM)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.bottomBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}>
                    <With value={variableConfig.bottomBar.centerWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.bottomBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.BOTTOM)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.bottomBar.rightWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.END}>
                    <With value={variableConfig.bottomBar.rightWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.bottomBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.BOTTOM)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }/>
    </box>
}
