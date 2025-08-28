import {Gtk} from "ags/gtk4"
import {addWidgets} from "../../barWidgets/BarWidgets";
import {variableConfig} from "../../../config/config";
import {createState, With} from "ags";
import {interval} from "ags/time";
import {Bar} from "../../../config/bar";

export const [topBarHeight, topBarHeightSetter] = createState(0)

export default function () {

    // wrapped in a box for the padding (margins of the center box)
    return <box
        $={(self) => {
            interval(1000, () => {
                topBarHeightSetter(self.get_allocated_height())
            })
            topBarHeightSetter(self.get_allocated_height())
        }}
        widthRequest={variableConfig.topBar.minimumWidth.asAccessor()}
        marginTop={variableConfig.topBar.marginTop.asAccessor()}
        marginBottom={variableConfig.topBar.marginBottom.asAccessor()}
        marginStart={variableConfig.topBar.marginStart.asAccessor()}
        marginEnd={variableConfig.topBar.marginEnd.asAccessor()}
        cssClasses={["topBar"]}>
        <centerbox
            marginTop={2}
            marginBottom={2}
            marginStart={2}
            marginEnd={2}
            hexpand={true}
            orientation={Gtk.Orientation.HORIZONTAL}
            startWidget={
                <box
                    visible={variableConfig.topBar.leftWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.START}>
                    <With value={variableConfig.topBar.leftWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.topBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.TOP)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.topBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}>
                    <With value={variableConfig.topBar.centerWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.topBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.TOP)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.topBar.rightWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.END}>
                    <With value={variableConfig.topBar.rightWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.topBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, Bar.TOP)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }/>
    </box>
}
