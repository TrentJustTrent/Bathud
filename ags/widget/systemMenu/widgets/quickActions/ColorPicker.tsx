import BButton, {BButtonSize} from "../../../common/BButton";
import {runColorPicker} from "../../../utils/colorPicker";

export default function () {
    return <BButton
        size={BButtonSize.XL}
        label=""
        offset={2}
        onClicked={() => {
            runColorPicker(500).catch((error) => console.log(error))
        }}/>
}