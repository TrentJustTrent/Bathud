import {Bar} from "../../config/bar";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {toggleIntegratedAppLauncher} from "../appLauncher/IntegratedAppLauncher";

export default function ({bar}: { bar: Bar }) {
    return <BButton
        labelCss={["barAppLauncherForeground"]}
        backgroundCss={["barAppLauncherBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="󰀻"
        onClicked={() => {
            toggleIntegratedAppLauncher()
        }}/>
}