import {Gtk} from "ags/gtk4";
import BButton, {BButtonHorizontalPadding} from "../common/BButton";
import {TimerDelete, TimerPlayPauseStop, timerText, timerTextVisible} from "../miscellaneous/Timer";
import {Bar} from "../../config/bar";
import {getHPadding, getVPadding} from "./BarWidgets";

export default function ({vertical, bar}: { vertical: boolean, bar: Bar}) {
    const text = timerText.as((text) => {
        if (!vertical) return text
        const splitText = text.split(":")
        return splitText.join("\n")
    })

    return <box
        cssClasses={["barTimerBackground"]}
        visible={timerTextVisible}
        orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}>
        <BButton
            hpadding={vertical ? BButtonHorizontalPadding.NONE : BButtonHorizontalPadding.THIN}
            vpadding={getVPadding(bar)}
            labelCss={["barTimerForeground"]}
            label={text}/>
        <TimerPlayPauseStop
            hpadding={getHPadding(bar)}
            vpadding={getVPadding(bar)}
            foregroundCss={["barTimerForeground"]}
            backgroundCss={["barTimerButtonBackground"]}/>
        <TimerDelete
            hpadding={getHPadding(bar)}
            vpadding={getVPadding(bar)}
            foregroundCss={["barTimerForeground"]}
            backgroundCss={["barTimerButtonBackground"]}/>
    </box>
}