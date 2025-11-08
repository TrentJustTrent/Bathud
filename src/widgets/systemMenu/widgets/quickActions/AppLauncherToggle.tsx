import BButton, {BButtonSize} from "../../../common/BButton";
import {integratedAppLauncherRevealed, toggleIntegratedAppLauncher} from "../../../appLauncher/IntegratedAppLauncher";

export default function () {
    return <BButton
        size={BButtonSize.XL}
        label="󰀻"
        offset={0}
        selected={integratedAppLauncherRevealed}
        onClicked={() => {
            toggleIntegratedAppLauncher()
        }}/>
}