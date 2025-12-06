import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import WallpaperSelect from "./WallpaperMenu";

export const integratedMonitorListHistoryWidth = 410

export const [integratedMonitorListRevealed, integratedMonitorListRevealedSetting] = createState(false)

export function toggleIntegratedMonitorList() {
    integratedMonitorListRevealedSetting(!integratedMonitorListRevealed.peek())
}

export function closeIntegratedMonitorList() {
    integratedMonitorListRevealedSetting(false)
}

export default function () {
    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedMonitorListRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={integratedMonitorListWidth}>
            <box
                marginStart={20}
                marginEnd={20}
                marginTop={20}>
                <WallpaperSelect/>
            </box>
        </Gtk.ScrolledWindow>
    </revealer>
}