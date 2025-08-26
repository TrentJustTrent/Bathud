import {Astal} from "ags/gtk4";
import VerticalFrame, {Side} from "./VerticalSpacer";

export default function (): Astal.Window {
    return <VerticalFrame side={Side.LEFT}/> as Astal.Window
}