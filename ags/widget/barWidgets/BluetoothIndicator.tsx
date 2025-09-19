import {Bar} from "../../config/bar";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import BButton from "../common/BButton";
import {getHPadding, getVPadding} from "./BarWidgets";
import {createBinding} from "ags";

export default function ({bar}: { bar: Bar }) {
    const bluetooth = AstalBluetooth.get_default()

    return <BButton
        labelCss={["barBluetoothForeground"]}
        backgroundCss={["barBluetoothBackground"]}
        label="󰂯"
        hpadding={getHPadding(bar)}
        vpadding={getVPadding(bar)}
        visible={createBinding(bluetooth, "isPowered").as((isPowered) => {
            return isPowered
        })}/>
}