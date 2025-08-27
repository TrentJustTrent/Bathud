import {Gtk} from "ags/gtk4";
import {variableConfig} from "../../config/config";
import {createState, With} from "ags";
import {addSystemMenuWidgets, createSystemWidgets} from "./SystemMenuWindow";

export const integratedMenuWidth = 410

export const [integratedMenuRevealed, integratedMenuRevealedSetting] = createState(false)

export default function () {
    const systemJsxWidgets = createSystemWidgets()

    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedMenuRevealed}
        cssClasses={["frameWindow"]}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={integratedMenuWidth}>
            <With value={variableConfig.systemMenu.widgets.asAccessor()}>
                {(widgets) => {
                    return <box
                        marginTop={20}
                        marginStart={20}
                        marginEnd={20}
                        marginBottom={20}
                        orientation={Gtk.Orientation.VERTICAL}
                        spacing={10}>
                        {addSystemMenuWidgets(widgets, systemJsxWidgets)}
                    </box>
                }}
            </With>
        </Gtk.ScrolledWindow>
    </revealer>
}