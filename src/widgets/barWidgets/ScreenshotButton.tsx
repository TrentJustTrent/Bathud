import {Bar} from "../../config/bar";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {toggleIntegratedScreenshot} from "../screenshot/IntegratedScreenshot";

export default function ({bar}: { bar: Bar }) {
    return <BButton
        labelCss={["barScreenshotForeground"]}
        backgroundCss={["barScreenshotBackground"]}
        offset={2}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label="󰹑"
        onClicked={() => {
            toggleIntegratedScreenshot()
        }}/>
}