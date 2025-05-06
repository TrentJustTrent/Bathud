import {App, Astal, Gtk} from "astal/gtk4"
import {addWidgets} from "./BarWidgets";
import {config, selectedBar} from "../../config/config";

import {Bar} from "../../config/bar";
import CavaWaveform from "../cava/CavaWaveform";
import {getCavaFlipStartValue} from "../utils/cava";

export default function () {
    return <window
        heightRequest={config.verticalBar.minimumHeight}
        cssClasses={["transparentBackground"]}
        monitor={config.mainMonitor}
        visible={selectedBar((bar) => {
            return bar === Bar.LEFT || bar === Bar.RIGHT
        })}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        margin={config.windows.gaps}
        anchor={selectedBar((bar) => {
            if (bar === Bar.LEFT) {
                if (!config.verticalBar.expanded) {
                    return Astal.WindowAnchor.LEFT
                }
                return Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.LEFT
                    | Astal.WindowAnchor.BOTTOM
            } else {
                if (!config.verticalBar.expanded) {
                    return Astal.WindowAnchor.RIGHT
                }
                return Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.RIGHT
                    | Astal.WindowAnchor.BOTTOM
            }
        })}
        application={App}>
        <overlay
            cssClasses={config.verticalBar.splitSections ? ["sideBar"] : ["barWindow", "sidebar"]}>
            <centerbox
                type={"overlay measure"}
                orientation={Gtk.Orientation.VERTICAL}>
                <box
                    visible={config.verticalBar.topWidgets.length > 0}
                    vertical={true}
                    cssClasses={config.verticalBar.splitSections ? ["barWindow"] : []}>
                    <box
                        vertical={true}
                        marginTop={config.verticalBar.sectionPadding}
                        marginBottom={config.verticalBar.sectionPadding}
                        spacing={config.verticalBar.widgetSpacing}>
                        {addWidgets(config.verticalBar.topWidgets, true)}
                    </box>
                </box>
                <box
                    visible={config.verticalBar.centerWidgets.length > 0}
                    vertical={true}
                    cssClasses={config.verticalBar.splitSections ? ["barWindow"] : []}>
                    <box
                        vertical={true}
                        marginTop={config.verticalBar.sectionPadding}
                        marginBottom={config.verticalBar.sectionPadding}
                        spacing={config.verticalBar.widgetSpacing}>
                        {addWidgets(config.verticalBar.centerWidgets, true)}
                    </box>
                </box>
                <box
                    visible={config.verticalBar.bottomWidgets.length > 0}
                    vertical={true}
                    valign={Gtk.Align.END}
                    cssClasses={config.verticalBar.splitSections ? ["barWindow"] : []}>
                    <box
                        vertical={true}
                        marginTop={config.verticalBar.sectionPadding}
                        marginBottom={config.verticalBar.sectionPadding}
                        spacing={config.verticalBar.widgetSpacing}>
                        {addWidgets(config.verticalBar.bottomWidgets, true)}
                    </box>
                </box>
            </centerbox>
            <box
                visible={config.verticalBar.enableFullBarCavaWaveform && !config.verticalBar.splitSections}>
                <CavaWaveform
                    vertical={true}
                    intensity={config.verticalBar.cavaWaveformIntensityMultiplier}
                    flipStart={getCavaFlipStartValue(true)}
                    expand={true}
                    length={400}
                    size={40}/>
            </box>
        </overlay>
    </window>
}
