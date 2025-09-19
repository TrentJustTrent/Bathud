import {createPoll} from "ags/time";
import GLib from "gi://GLib?version=2.0";
import BButton, {BButtonHorizontalPadding} from "../common/BButton";
import {Bar} from "../../config/bar";
import {getVPadding} from "./BarWidgets";
import {toggleIntegratedCalendar} from "../miscellaneous/IntegratedMisc";

export default function ({vertical, bar}: { vertical: boolean, bar: Bar }) {
    let format: string

    if (vertical) {
        format = "%I\n%M"
    } else {
        format = "%I:%M"
    }

    const time = createPoll("", 1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <BButton
        labelCss={["barClockForeground"]}
        backgroundCss={["barClockBackground"]}
        hexpand={vertical}
        hpadding={vertical ? BButtonHorizontalPadding.NONE : BButtonHorizontalPadding.THIN}
        vpadding={getVPadding(bar)}
        label={time}
        onClicked={() => {
            toggleIntegratedCalendar()
        }}/>
}