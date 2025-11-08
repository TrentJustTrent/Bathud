import {Bar} from "../../config/bar";
import BButton from "../common/BButton";
import {variableConfig} from "../../config/config";
import {getHPadding, getVPadding} from "./BarWidgets";
import {
    integratedMenuRevealed,
    integratedMenuRevealedSetting,
    toggleIntegratedMenu
} from "../systemMenu/IntegratedMenu";

export default function ({bar}: { bar: Bar }) {
    return <BButton
        labelCss={["barMenuForeground"]}
        backgroundCss={["barMenuBackground"]}
        offset={variableConfig.barWidgets.menu.iconOffset.asAccessor()}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={variableConfig.barWidgets.menu.icon.asAccessor()}
        onClicked={() => {
            toggleIntegratedMenu()
        }}/>
}