import {Gtk} from "ags/gtk4";
import OkButton from "../common/OkButton";
import {TimerDelete, TimerPlayPauseStop, timerText, timerTextVisible} from "../calendar/Timer";

export default function ({vertical}: { vertical: boolean}) {
    const text = timerText.as((text) => {
        if (!vertical) return text
        const splitText = text.split(":")
        return splitText.join("\n")
    })

    return <box
        cssClasses={["barTimerBackground"]}
        visible={timerTextVisible}
        orientation={vertical ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}>
        <OkButton
            labelCss={["barTimerForeground"]}
            label={text}/>
        <TimerPlayPauseStop
            foregroundCss={["barTimerForeground"]}
            backgroundCss={["barTimerButtonBackground"]}/>
        <TimerDelete
            foregroundCss={["barTimerForeground"]}
            backgroundCss={["barTimerButtonBackground"]}/>
    </box>
}