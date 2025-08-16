import App from "ags/gtk4/app"
import {addWidgets} from "./BarWidgets";
import {variableConfig} from "../../config/config";
import {Bar, selectedBar} from "../../config/bar";
import Astal from "gi://Astal?version=4.0";
import {Gtk} from "ags/gtk4";
import {createComputed, createState, With} from "ags"
import {addSystemMenuWidgets, createSystemWidgets} from "../systemMenu/SystemMenuWindow";

export const verticalBarWindowName = "verticalBar"

export const [integratedMenuRevealed, integratedMenuRevealedSetting] = createState(false)

export default function () {
    const marginLeft = createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.marginOuter.asAccessor(),
        variableConfig.verticalBar.marginInner.asAccessor()
    ], (bar, outer, inner): number => {
        if (bar === Bar.LEFT) {
            return outer
        } else {
            return inner
        }
    })

    const marginRight = createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.marginOuter.asAccessor(),
        variableConfig.verticalBar.marginInner.asAccessor()
    ], (bar, outer, inner): number => {
        if (bar === Bar.RIGHT) {
            return outer
        } else {
            return inner
        }
    })

    const anchor = createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.expanded.asAccessor()
    ], (bar, expanded) => {
        if (bar === Bar.LEFT) {
            if (!expanded) {
                return Astal.WindowAnchor.LEFT
            }
            return Astal.WindowAnchor.TOP
                | Astal.WindowAnchor.LEFT
                | Astal.WindowAnchor.BOTTOM
        } else {
            if (!expanded) {
                return Astal.WindowAnchor.RIGHT
            }
            return Astal.WindowAnchor.TOP
                | Astal.WindowAnchor.RIGHT
                | Astal.WindowAnchor.BOTTOM
        }
    })

    const systemJsxWidgets = createSystemWidgets()

    const integratedMenu = <revealer
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        visible={variableConfig.verticalBar.integratedMenu.asAccessor()}
        revealChild={integratedMenuRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={400}>
            <box
                marginTop={20}
                marginStart={20}
                marginEnd={20}
                marginBottom={20}
                orientation={Gtk.Orientation.VERTICAL}
                spacing={10}>
                <With value={variableConfig.systemMenu.widgets.asAccessor()}>
                    {(widgets) => {
                        return <box orientation={Gtk.Orientation.VERTICAL}>
                            {addSystemMenuWidgets(widgets, systemJsxWidgets)}
                        </box>
                    }}
                </With>
            </box>
        </Gtk.ScrolledWindow>
    </revealer>

    return <window
        defaultHeight={variableConfig.verticalBar.minimumHeight.asAccessor()}
        defaultWidth={1} // necessary or resizing doesn't work
        name={verticalBarWindowName}
        layer={Astal.Layer.BOTTOM}
        namespace={"okpanel-vertical-bar"}
        heightRequest={variableConfig.verticalBar.minimumHeight.asAccessor()}
        cssClasses={["transparentBackground"]}
        monitor={variableConfig.mainMonitor.asAccessor()}
        visible={selectedBar.asAccessor()(bar =>
            bar === Bar.LEFT || bar === Bar.RIGHT
        )}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        // this window doesn't like marginStart for some reason
        marginLeft={marginLeft}
        marginRight={marginRight}
        marginTop={variableConfig.verticalBar.marginStart.asAccessor()}
        marginBottom={variableConfig.verticalBar.marginEnd.asAccessor()}
        anchor={anchor}
        application={App}>
        <box
            orientation={Gtk.Orientation.HORIZONTAL}
            cssClasses={variableConfig.verticalBar.splitSections.asAccessor().as((split) =>
                split ? ["sideBar"] : ["barWindow", "sideBar"]
            )}>
            <With value={selectedBar.asAccessor()}>
                {(bar) => {
                    if (bar === Bar.LEFT) {
                        return integratedMenu
                    } else {
                        return <box/>
                    }
                }}
            </With>
            <centerbox
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
                        <box
                            orientation={Gtk.Orientation.VERTICAL}
                            marginTop={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            marginBottom={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            spacing={variableConfig.verticalBar.widgetSpacing.asAccessor()}>
                            <With value={variableConfig.verticalBar.topWidgets.asAccessor()}>
                                {widgets => <box orientation={Gtk.Orientation.VERTICAL}>
                                    {addWidgets(widgets, true)}
                                </box>}
                            </With>
                        </box>
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
                        <box
                            orientation={Gtk.Orientation.VERTICAL}
                            marginTop={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            marginBottom={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            spacing={variableConfig.verticalBar.widgetSpacing.asAccessor()}>
                            <With value={variableConfig.verticalBar.centerWidgets.asAccessor()}>
                                {widgets => <box orientation={Gtk.Orientation.VERTICAL}>
                                    {addWidgets(widgets, true)}
                                </box>}
                            </With>
                        </box>
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
                        <box
                            orientation={Gtk.Orientation.VERTICAL}
                            marginTop={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            marginBottom={variableConfig.verticalBar.sectionPadding.asAccessor()}
                            spacing={variableConfig.verticalBar.widgetSpacing.asAccessor()}>
                            <With value={variableConfig.verticalBar.bottomWidgets.asAccessor()}>
                                {widgets => <box orientation={Gtk.Orientation.VERTICAL}>
                                    {addWidgets(widgets, true)}
                                </box>}
                            </With>
                        </box>
                    </box> as Gtk.Widget
                }/>
            <With value={selectedBar.asAccessor()}>
                {(bar) => {
                    if (bar === Bar.RIGHT) {
                        return integratedMenu
                    } else {
                        return <box/>
                    }
                }}
            </With>
        </box>
    </window>
}
