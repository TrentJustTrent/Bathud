import {Gtk} from "ags/gtk4";
import {createState} from "ags";
import Weather from "./Weather";
import Calendar from "./Calendar";

export const integratedCalendarWidth = 410

export const [integratedCalendarRevealed, integratedCalendarRevealedSetting] = createState(false)

export function toggleIntegratedCalendar() {
    integratedCalendarRevealedSetting(!integratedCalendarRevealed.get())
}

export default function () {
    return <revealer
        hexpand={false}
        transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        revealChild={integratedCalendarRevealed}
        cssClasses={["frameWindow"]}>
        <box
            marginTop={20}
            marginBottom={20}
            hexpand={false}
            orientation={Gtk.Orientation.VERTICAL}
            widthRequest={integratedCalendarWidth}
            spacing={20}>
            <Calendar/>
            <Weather/>
        </box>
    </revealer>
}