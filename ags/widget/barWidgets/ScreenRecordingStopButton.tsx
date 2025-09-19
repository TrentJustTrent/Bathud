import {Bar} from "../../config/bar";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {execAsync} from "ags/process";
import {isRecording} from "../screenshot/ScreenRecording";

export default function ({bar}: { bar: Bar }) {
    return <BButton
        labelCss={["barRecordingIndicatorForeground"]}
        backgroundCss={["barRecordingIndicatorBackground"]}
        offset={2}
        warning={true}
        label=""
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        visible={isRecording}
        onClicked={() => {
            execAsync("pkill wf-recorder")
                .catch((error) => {
                    console.error(error)
                })
        }}/>
}