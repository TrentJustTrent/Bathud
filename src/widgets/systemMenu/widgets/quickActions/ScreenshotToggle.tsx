import BButton, {BButtonSize} from "../../../common/BButton";
import {integratedScreenshotRevealed, toggleIntegratedScreenshot} from "../../../screenshot/IntegratedScreenshot";

export default function () {
    return <BButton
        size={BButtonSize.XL}
        label="󰹑"
        offset={3}
        selected={integratedScreenshotRevealed}
        onClicked={() => {
            toggleIntegratedScreenshot()
        }}/>
}