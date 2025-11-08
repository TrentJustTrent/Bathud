import {Bar} from "../../config/bar";
import Wp from "gi://AstalWp"
import {createBinding, createComputed} from "ags";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {getVolumeIcon} from "../utils/audio";

export default function ({bar}: { bar: Bar }) {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker

    const speakerVar = createComputed([
        createBinding(defaultSpeaker, "description"),
        createBinding(defaultSpeaker, "volume"),
        createBinding(defaultSpeaker, "mute")
    ])

    return <BButton
        labelCss={["barAudioOutForeground"]}
        backgroundCss={["barAudioOutBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={speakerVar(() => getVolumeIcon(defaultSpeaker))}/>
}