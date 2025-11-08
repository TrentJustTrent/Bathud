import {Bar} from "../../config/bar";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {getNetworkIconBinding} from "../utils/network";

export default function ({bar}: { bar: Bar }) {
    return <BButton
        labelCss={["barNetworkForeground"]}
        backgroundCss={["barNetworkBackground"]}
        offset={1}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={getNetworkIconBinding()}/>
}