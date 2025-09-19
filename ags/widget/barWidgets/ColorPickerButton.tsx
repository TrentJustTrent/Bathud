import {Bar} from "../../config/bar";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {runColorPicker} from "../utils/colorPicker";

export default function ({ bar}: { bar: Bar }) {
    return <BButton
        labelCss={["barColorPickerForeground"]}
        backgroundCss={["barColorPickerBackground"]}
        offset={2}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label=""
        onClicked={() => {
            runColorPicker().catch((error) => console.log(error))
        }}/>
}