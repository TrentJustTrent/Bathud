import {createPoll} from "../../../../../../../usr/share/ags/js/lib/time";
import GLib from "gi://GLib?version=2.0";
import BButton, {BButtonHorizontalPadding} from "../common/BButton";
import {Bar} from "../../config/bar";
import {getVPadding} from "./BarWidgets";
import {toggleIntegratedMiscellaneous} from "../miscellaneous/IntegratedMiscellaneous";
import {variableConfig} from "../../config/config";

export default function ({vertical, bar}: { vertical: boolean, bar: Bar }) {
    const time = createPoll("", 1000, () => {
        const use24h = variableConfig.clockFormat24h.peek()
        let format: string

        if (vertical) {
            format = use24h ? "%H\n%M" : "%I\n%M"
        } else {
            format = use24h ? "%H:%M" : "%I:%M"
        }

        return GLib.DateTime.new_now_local().format(format)!
    })

    return <BButton
        labelCss={["barClockForeground"]}
        backgroundCss={["barClockBackground"]}
        hexpand={vertical}
        hpadding={vertical ? BButtonHorizontalPadding.NONE : BButtonHorizontalPadding.THIN}
        vpadding={getVPadding(bar)}
        label={time}
        onClicked={() => {
            toggleIntegratedMiscellaneous()
        }}/>
}