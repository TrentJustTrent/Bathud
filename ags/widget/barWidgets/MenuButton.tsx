import {Bar} from "../../config/bar";
import OkButton from "../common/OkButton";
import {variableConfig} from "../../config/config";
import {getHPadding, getVPadding} from "./BarWidgets";
import {integratedMenuRevealed, integratedMenuRevealedSetting} from "../systemMenu/IntegratedMenu";

export default function ({bar}: { bar: Bar }) {
    return <OkButton
        labelCss={["barMenuForeground"]}
        backgroundCss={["barMenuBackground"]}
        offset={variableConfig.barWidgets.menu.iconOffset.asAccessor()}
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        label={variableConfig.barWidgets.menu.icon.asAccessor()}
        onClicked={() => {
            integratedMenuRevealedSetting(!integratedMenuRevealed.get())
        }}/>
}