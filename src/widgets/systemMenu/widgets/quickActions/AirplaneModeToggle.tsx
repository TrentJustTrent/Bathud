import BButton, {BButtonSize} from "../../../common/BButton";
import {airplaneModeEnabled, disableAirplaneMode, enableAirplaneMode} from "../NetworkControls";

export default function () {
    return <BButton
        size={BButtonSize.XL}
        label="󰀝"
        offset={0}
        selected={airplaneModeEnabled}
        onClicked={() => {
            if (airplaneModeEnabled.peek()) {
                disableAirplaneMode()
            } else {
                enableAirplaneMode()
            }
        }}/>
}