import {App, Astal, Gtk} from "astal/gtk4"
import {addWidgets} from "./BarWidgets";
import {selectedBar, variableConfig} from "../../config/config";
import {Bar} from "../../config/bar";
import CavaWaveform from "../cava/CavaWaveform";
import {getCavaFlipStartValue} from "../utils/cava";
import {Variable} from "astal";

export default function () {
    const marginLeft = Variable.derive([
        selectedBar,
        variableConfig.verticalBar.marginOuter,
        variableConfig.verticalBar.marginInner
    ], (bar, outer, inner): number => {
        if (bar === Bar.LEFT) {
            return outer
        } else {
            return inner
        }
    })

    const marginRight = Variable.derive([
        selectedBar,
        variableConfig.verticalBar.marginOuter,
        variableConfig.verticalBar.marginInner
    ], (bar, outer, inner): number => {
        if (bar === Bar.RIGHT) {
            return outer
        } else {
            return inner
        }
    })

    const anchor = Variable.derive([
        selectedBar,
        variableConfig.verticalBar.expanded
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

    const fullBarCavaEnabled = Variable.derive([
        variableConfig.verticalBar.fullBarCavaWaveform.enabled,
        variableConfig.verticalBar.splitSections
    ], (enabled, split) => {
        return enabled && !split
    })

    return <window
        heightRequest={variableConfig.verticalBar.minimumHeight()}
        cssClasses={["transparentBackground"]}
        monitor={variableConfig.mainMonitor()}
        visible={selectedBar((bar) => {
            return bar === Bar.LEFT || bar === Bar.RIGHT
        })}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        // this window doesn't like marginStart for some reason
        marginLeft={marginLeft()}
        marginRight={marginRight()}
        marginTop={variableConfig.verticalBar.marginStart()}
        marginBottom={variableConfig.verticalBar.marginEnd()}
        anchor={anchor()}
        application={App}>
        <overlay
            cssClasses={variableConfig.verticalBar.splitSections().as((split) =>
                split ? ["sideBar"] : ["barWindow", "sideBar"]
            )}>
            <centerbox
                type={"overlay measure"}
                orientation={Gtk.Orientation.VERTICAL}>
                <box
                    visible={variableConfig.verticalBar.topWidgets().as((widgets) =>
                        widgets.length > 0
                    )}
                    vertical={true}
                    cssClasses={variableConfig.verticalBar.splitSections().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <box
                        vertical={true}
                        marginTop={variableConfig.verticalBar.sectionPadding()}
                        marginBottom={variableConfig.verticalBar.sectionPadding()}
                        spacing={variableConfig.verticalBar.widgetSpacing()}>
                        {variableConfig.verticalBar.topWidgets().as((widgets) =>
                            addWidgets(widgets, true)
                        )}
                    </box>
                </box>
                <box
                    visible={variableConfig.verticalBar.centerWidgets().as((widgets) =>
                        widgets.length > 0
                    )}
                    vertical={true}
                    cssClasses={variableConfig.verticalBar.splitSections().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <box
                        vertical={true}
                        marginTop={variableConfig.verticalBar.sectionPadding()}
                        marginBottom={variableConfig.verticalBar.sectionPadding()}
                        spacing={variableConfig.verticalBar.widgetSpacing()}>
                        {variableConfig.verticalBar.centerWidgets().as((widgets) =>
                            addWidgets(widgets, true)
                        )}
                    </box>
                </box>
                <box
                    visible={variableConfig.verticalBar.bottomWidgets().as((widgets) =>
                        widgets.length > 0
                    )}
                    vertical={true}
                    valign={Gtk.Align.END}
                    cssClasses={variableConfig.verticalBar.splitSections().as((split) =>
                        split ? ["barWindow"] : []
                    )}>
                    <box
                        vertical={true}
                        marginTop={variableConfig.verticalBar.sectionPadding()}
                        marginBottom={variableConfig.verticalBar.sectionPadding()}
                        spacing={variableConfig.verticalBar.widgetSpacing()}>
                        {variableConfig.verticalBar.bottomWidgets().as((widgets) =>
                            addWidgets(widgets, true)
                        )}
                    </box>
                </box>
            </centerbox>
            <box>
                {fullBarCavaEnabled().as((enabled) => {
                    if (enabled) {
                        return <CavaWaveform
                            vertical={true}
                            intensity={variableConfig.verticalBar.fullBarCavaWaveform.intensityMultiplier()}
                            flipStart={getCavaFlipStartValue(true)}
                            expand={true}
                            length={10}
                            size={40}/>
                    } else {
                        return <box/>
                    }
                })}
            </box>
        </overlay>
    </window>
}
