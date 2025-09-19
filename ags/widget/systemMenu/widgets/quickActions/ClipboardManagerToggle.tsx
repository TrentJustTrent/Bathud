import BButton, {BButtonSize} from "../../../common/BButton";
import {
    integratedClipboardManagerRevealed,
    toggleIntegratedClipboardManager
} from "../../../clipboardManager/IntegratedClipboardManager";

export default function () {
    return <BButton
        size={BButtonSize.XL}
        label=""
        offset={1}
        selected={integratedClipboardManagerRevealed}
        onClicked={() => {
            toggleIntegratedClipboardManager()
        }}/>
}