import {Bar} from "../../config/bar";
import OkButton from "../common/OkButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {isRecording} from "../screenshot/Screenshot";
import {execAsync} from "ags/process";

export default function ({bar}: { bar: Bar }) {
    return <OkButton
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