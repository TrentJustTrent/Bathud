import {Bar} from "../../config/bar";
import {startCliphist} from "../clipboardManager/ClipboardManager";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {toggleIntegratedClipboardManager} from "../clipboardManager/IntegratedClipboardManager";

export default function ({bar}: { bar: Bar }) {
    startCliphist()
    return <BButton
        labelCss={["barClipboardManagerForeground"]}
        backgroundCss={["barClipboardManagerBackground"]}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label=""
        onClicked={() => {
            toggleIntegratedClipboardManager()
        }}/>
}