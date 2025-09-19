import {variableConfig} from "../../config/config";
import {Bar} from "../../config/bar";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import {BButtonHorizontalPadding, BButtonVerticalPadding} from "../common/BButton";
import MenuButton from "./MenuButton";
import Workspaces from "./Workspaces";
import Clock from "./Clock";
import AudioOut from "./AudioOut";
import AudioIn from "./AudioIn";
import BluetoothIndicator from "./BluetoothIndicator";
import NetworkIndicator from "./NetworkIndicator";
import BatteryIndicator from "./BatteryIndicator";
import Tray from "./Tray";
import AppLauncherButton from "./AppLauncherButton";
import ScreenshotButton from "./ScreenshotButton";
import ClipboardManagerButton from "./ClipboardManagerButton";
import CavaBars from "./CavaBars";
import VpnIndicator from "./VpnIndicator";
import ScreenRecordingStopButton from "./ScreenRecordingStopButton";
import MprisControls from "./MprisControls";
import MprisTrackInfoBarWidget from "./MprisTrackInfoBarWidget";
import MprisPrimaryPlayerSwitcher from "./MprisPrimaryPlayerSwitcher";
import NotificationButton from "./NotificationButton";
import ColorPickerButton from "./ColorPickerButton";
import TimerInBar from "./TimerInBar";
import CustomWidget from "./CustomWidget";
import Shortcut from "./Shortcut";

export function getHPadding(bar: Bar) {
    switch (bar) {
        case Bar.TOP:
        case Bar.BOTTOM:
            return BButtonHorizontalPadding.THIN
        case Bar.LEFT:
            return variableConfig.leftBar.compact.asAccessor().as((c) =>
                c ? BButtonHorizontalPadding.THIN : BButtonHorizontalPadding.STANDARD)
        case Bar.RIGHT:
            return variableConfig.rightBar.compact.asAccessor().as((c) =>
                c ? BButtonHorizontalPadding.THIN : BButtonHorizontalPadding.STANDARD)
    }
}

export function getVPadding(bar: Bar) {
    switch (bar) {
        case Bar.TOP:
            return variableConfig.topBar.compact.asAccessor().as((c) =>
                c ? BButtonVerticalPadding.THIN : BButtonVerticalPadding.STANDARD)
        case Bar.BOTTOM:
            return variableConfig.bottomBar.compact.asAccessor().as((c) =>
                c ? BButtonVerticalPadding.THIN : BButtonVerticalPadding.STANDARD)
        case Bar.LEFT:
        case Bar.RIGHT:
            return BButtonVerticalPadding.STANDARD
    }
}

export function addWidgets(widgets: BarWidget[], bar: Bar) {
    let isVertical
    switch (bar) {
        case Bar.TOP:
            isVertical = false
            break
        case Bar.BOTTOM:
            isVertical = false
            break
        case Bar.LEFT:
            isVertical = true
            break
        case Bar.RIGHT:
            isVertical = true
            break
    }
    return widgets.map((widget) => {
        return <box
            marginTop={variableConfig.barWidgets[widget].marginTop.asAccessor()}
            marginBottom={variableConfig.barWidgets[widget].marginBottom.asAccessor()}
            marginStart={variableConfig.barWidgets[widget].marginStart.asAccessor()}
            marginEnd={variableConfig.barWidgets[widget].marginEnd.asAccessor()}>
            {getWidget(widget, isVertical, bar)}
        </box>
    })
}

function getWidget(widget: BarWidget, isVertical: boolean, bar: Bar) {
    switch (widget) {
        case BarWidget.MENU:
            return <MenuButton bar={bar}/>
        case BarWidget.WORKSPACES:
            return <Workspaces bar={bar} vertical={isVertical}/>
        case BarWidget.CLOCK:
            return <Clock bar={bar} vertical={isVertical}/>
        case BarWidget.AUDIO_OUT:
            return <AudioOut bar={bar}/>
        case BarWidget.AUDIO_IN:
            return <AudioIn bar={bar}/>
        case BarWidget.BLUETOOTH:
            return <BluetoothIndicator bar={bar}/>
        case BarWidget.NETWORK:
            return <NetworkIndicator bar={bar}/>
        case BarWidget.BATTERY:
            return <BatteryIndicator bar={bar}/>
        case BarWidget.TRAY:
            return <Tray bar={bar} vertical={isVertical}/>
        case BarWidget.APP_LAUNCHER:
            return <AppLauncherButton bar={bar}/>
        case BarWidget.SCREENSHOT:
            return <ScreenshotButton bar={bar}/>
        case BarWidget.CLIPBOARD_MANAGER:
            return <ClipboardManagerButton bar={bar}/>
        case BarWidget.CAVA_WAVEFORM:
            return <CavaBars bar={bar} vertical={isVertical}/>
        case BarWidget.VPN_INDICATOR:
            return <VpnIndicator bar={bar}/>
        case BarWidget.RECORDING_INDICATOR:
            return <ScreenRecordingStopButton bar={bar}/>
        case BarWidget.MPRIS_CONTROLS:
            return <MprisControls vertical={isVertical} bar={bar}/>
        case BarWidget.MPRIS_TRACK_INFO:
            return <MprisTrackInfoBarWidget bar={bar} vertical={isVertical}/>
        case BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER:
            return <MprisPrimaryPlayerSwitcher bar={bar}/>
        case BarWidget.NOTIFICATION_HISTORY:
            return <NotificationButton bar={bar}/>
        case BarWidget.COLOR_PICKER:
            return <ColorPickerButton bar={bar}/>
        case BarWidget.TIMER:
            return <TimerInBar vertical={isVertical} bar={bar}/>

        case BarWidget.CUSTOM1:
            return <CustomWidget customNumber={1} bar={bar}/>
        case BarWidget.CUSTOM2:
            return <CustomWidget customNumber={2} bar={bar}/>
        case BarWidget.CUSTOM3:
            return <CustomWidget customNumber={3} bar={bar}/>
        case BarWidget.CUSTOM4:
            return <CustomWidget customNumber={4} bar={bar}/>
        case BarWidget.CUSTOM5:
            return <CustomWidget customNumber={5} bar={bar}/>
        case BarWidget.CUSTOM6:
            return <CustomWidget customNumber={6} bar={bar}/>
        case BarWidget.CUSTOM7:
            return <CustomWidget customNumber={7} bar={bar}/>
        case BarWidget.CUSTOM8:
            return <CustomWidget customNumber={8} bar={bar}/>
        case BarWidget.CUSTOM9:
            return <CustomWidget customNumber={9} bar={bar}/>
        case BarWidget.CUSTOM10:
            return <CustomWidget customNumber={10} bar={bar}/>
        case BarWidget.CUSTOM11:
            return <CustomWidget customNumber={11} bar={bar}/>
        case BarWidget.CUSTOM12:
            return <CustomWidget customNumber={12} bar={bar}/>
        case BarWidget.CUSTOM13:
            return <CustomWidget customNumber={13} bar={bar}/>
        case BarWidget.CUSTOM14:
            return <CustomWidget customNumber={14} bar={bar}/>
        case BarWidget.CUSTOM15:
            return <CustomWidget customNumber={15} bar={bar}/>
        case BarWidget.CUSTOM16:
            return <CustomWidget customNumber={16} bar={bar}/>
        case BarWidget.CUSTOM17:
            return <CustomWidget customNumber={17} bar={bar}/>
        case BarWidget.CUSTOM18:
            return <CustomWidget customNumber={18} bar={bar}/>
        case BarWidget.CUSTOM19:
            return <CustomWidget customNumber={19} bar={bar}/>
        case BarWidget.CUSTOM20:
            return <CustomWidget customNumber={20} bar={bar}/>

        case BarWidget.SHORTCUT1:
            return <Shortcut shortcutNumber={1} bar={bar}/>
        case BarWidget.SHORTCUT2:
            return <Shortcut shortcutNumber={2} bar={bar}/>
        case BarWidget.SHORTCUT3:
            return <Shortcut shortcutNumber={3} bar={bar}/>
        case BarWidget.SHORTCUT4:
            return <Shortcut shortcutNumber={4} bar={bar}/>
        case BarWidget.SHORTCUT5:
            return <Shortcut shortcutNumber={5} bar={bar}/>
        case BarWidget.SHORTCUT6:
            return <Shortcut shortcutNumber={6} bar={bar}/>
        case BarWidget.SHORTCUT7:
            return <Shortcut shortcutNumber={7} bar={bar}/>
        case BarWidget.SHORTCUT8:
            return <Shortcut shortcutNumber={8} bar={bar}/>
        case BarWidget.SHORTCUT9:
            return <Shortcut shortcutNumber={9} bar={bar}/>
        case BarWidget.SHORTCUT10:
            return <Shortcut shortcutNumber={10} bar={bar}/>
        case BarWidget.SHORTCUT11:
            return <Shortcut shortcutNumber={11} bar={bar}/>
        case BarWidget.SHORTCUT12:
            return <Shortcut shortcutNumber={12} bar={bar}/>
        case BarWidget.SHORTCUT13:
            return <Shortcut shortcutNumber={13} bar={bar}/>
        case BarWidget.SHORTCUT14:
            return <Shortcut shortcutNumber={14} bar={bar}/>
        case BarWidget.SHORTCUT15:
            return <Shortcut shortcutNumber={15} bar={bar}/>
        case BarWidget.SHORTCUT16:
            return <Shortcut shortcutNumber={16} bar={bar}/>
        case BarWidget.SHORTCUT17:
            return <Shortcut shortcutNumber={17} bar={bar}/>
        case BarWidget.SHORTCUT18:
            return <Shortcut shortcutNumber={18} bar={bar}/>
        case BarWidget.SHORTCUT19:
            return <Shortcut shortcutNumber={19} bar={bar}/>
        case BarWidget.SHORTCUT20:
            return <Shortcut shortcutNumber={20} bar={bar}/>
    }
}
