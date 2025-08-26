import {Gtk} from "ags/gtk4"
import {addWidgets} from "./BarWidgets";
import {variableConfig} from "../../config/config";
import {Bar, selectedBar} from "../../config/bar";
import {createState, With} from "ags";
import {interval} from "ags/time";

export const [horizontalBarHeight, horizontalBarHeightSetter] = createState(0)

export default function ({setup}: {setup: (self: Gtk.Widget) => void}) {

    // wrapped in a box for the padding (margins of the center box)
    return <box
        $={(self) => {
            setup(self)

            interval(1000, () => {
                horizontalBarHeightSetter(self.get_allocated_height())
            })
            horizontalBarHeightSetter(self.get_allocated_height())
        }}
        cssClasses={["frameWindow"]}
        visible={selectedBar.asAccessor()((bar) => {
            return bar === Bar.TOP || bar === Bar.BOTTOM
        })}>
        <centerbox
            marginTop={2}
            marginBottom={2}
            marginStart={2}
            marginEnd={2}
            hexpand={true}
            orientation={Gtk.Orientation.HORIZONTAL}
            startWidget={
                <box
                    visible={variableConfig.horizontalBar.leftWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.START}>
                    <With value={variableConfig.horizontalBar.leftWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.horizontalBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, false)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            centerWidget={
                <box
                    visible={variableConfig.horizontalBar.centerWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}>
                    <With value={variableConfig.horizontalBar.centerWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.horizontalBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, false)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }
            endWidget={
                <box
                    visible={variableConfig.horizontalBar.rightWidgets.asAccessor().as((widgets) =>
                        widgets.length > 0
                    )}
                    halign={Gtk.Align.END}>
                    <With value={variableConfig.horizontalBar.rightWidgets.asAccessor()}>
                        {widgets => <box
                            orientation={Gtk.Orientation.HORIZONTAL}
                            spacing={variableConfig.horizontalBar.widgetSpacing.asAccessor()}>
                            {addWidgets(widgets, false)}
                        </box>}
                    </With>
                </box> as Gtk.Widget
            }/>
    </box>
}
