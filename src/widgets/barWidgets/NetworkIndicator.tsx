import {Bar} from "../../config/bar";
import OkButton from "../common/OkButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {getNetworkIconBinding} from "../utils/network";

export default function ({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barNetworkForeground"]}
        backgroundCss={["barNetworkBackground"]}
        offset={1}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={getNetworkIconBinding()}/>
}