import {Astal} from "ags/gtk4";
import HorizontalFrame, {Side} from "./HorizontalSpacer";

export default function(): Astal.Window {
    return <HorizontalFrame side={Side.BOTTOM}/> as Astal.Window
}