import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import NotificationHistory from "../systemMenu/widgets/NotificationHistory";
import {applyStyleChangeFix} from "../utils/styleFix";

export const integratedNotificationHistoryWidth = 410

export const [integratedNotificationHistoryRevealed, integratedNotificationHistoryRevealedSetting] = createState(false)

export function toggleIntegratedNotificationHistory() {
    integratedNotificationHistoryRevealedSetting(!integratedNotificationHistoryRevealed.get())
}

export default function () {
    return <revealer
        $={(self) => {
            applyStyleChangeFix(self, integratedNotificationHistoryRevealed)
        }}
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedNotificationHistoryRevealed}>
        <Gtk.ScrolledWindow
            cssClasses={["scrollWindow"]}
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            widthRequest={integratedNotificationHistoryWidth}>
            <box
                marginStart={20}
                marginEnd={20}
                marginTop={20}>
                <NotificationHistory/>
            </box>
        </Gtk.ScrolledWindow>
    </revealer>
}