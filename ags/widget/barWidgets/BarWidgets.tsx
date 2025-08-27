import {variableConfig} from "../../config/config";
import {Bar} from "../../config/bar";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import {OkButtonHorizontalPadding, OkButtonVerticalPadding} from "../common/OkButton";
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
import PowerProfileIndicator from "./PowerProfileIndicator";
import LockButton from "./LockButton";
import LogoutButton from "./LogoutButton";
import RestartButton from "./RestartButton";
import ShutdownButton from "./ShutdownButton";
import CavaBars from "./CavaBars";
import VpnIndicator from "./VpnIndicator";
import ScreenRecordingStopButton from "./ScreenRecordingStopButton";
import MprisControls from "./MprisControls";
import MprisTrackInfoBarWidget from "./MprisTrackInfoBarWidget";
import MprisPrimaryPlayerSwitcher from "./MprisPrimaryPlayerSwitcher";
import NotificationButton from "./NotificationButton";
import ColorPickerButton from "./ColorPickerButton";

export function getHPadding(bar: Bar) {
    switch (bar) {
        case Bar.TOP:
        case Bar.BOTTOM:
            return OkButtonHorizontalPadding.THIN
        case Bar.LEFT:
            return variableConfig.leftBar.compact.asAccessor().as((c) =>
                c ? OkButtonHorizontalPadding.THIN : OkButtonHorizontalPadding.STANDARD)
        case Bar.RIGHT:
            return variableConfig.rightBar.compact.asAccessor().as((c) =>
                c ? OkButtonHorizontalPadding.THIN : OkButtonHorizontalPadding.STANDARD)
    }
}

export function getVPadding(bar: Bar) {
    switch (bar) {
        case Bar.TOP:
            return variableConfig.topBar.compact.asAccessor().as((c) =>
                c ? OkButtonVerticalPadding.THIN : OkButtonVerticalPadding.STANDARD)
        case Bar.BOTTOM:
            return variableConfig.bottomBar.compact.asAccessor().as((c) =>
                c ? OkButtonVerticalPadding.THIN : OkButtonVerticalPadding.STANDARD)
        case Bar.LEFT:
        case Bar.RIGHT:
            return OkButtonVerticalPadding.STANDARD
    }
}

export function addWidgets(widgets: BarWidget[], bar: Bar) {
    let schema
    let isVertical
    switch (bar) {
        case Bar.TOP:
            schema = variableConfig.topBar
            isVertical = false
            break
        case Bar.BOTTOM:
            schema = variableConfig.bottomBar
            isVertical = false
            break
        case Bar.LEFT:
            schema = variableConfig.leftBar
            isVertical = true
            break
        case Bar.RIGHT:
            schema = variableConfig.rightBar
            isVertical = true
            break
    }
    return widgets.map((widget) => {
        return <box
            marginTop={schema[widget].marginTop.asAccessor()}
            marginBottom={schema[widget].marginBottom.asAccessor()}
            marginStart={schema[widget].marginStart.asAccessor()}
            marginEnd={schema[widget].marginEnd.asAccessor()}>
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
        case BarWidget.POWER_PROFILE:
            return <PowerProfileIndicator bar={bar}/>
        case BarWidget.LOCK:
            return <LockButton bar={bar}/>
        case BarWidget.LOGOUT:
            return <LogoutButton bar={bar}/>
        case BarWidget.RESTART:
            return <RestartButton bar={bar}/>
        case BarWidget.SHUTDOWN:
            return <ShutdownButton bar={bar}/>
        case BarWidget.CAVA_WAVEFORM:
            return <CavaBars bar={bar} vertical={isVertical}/>
        case BarWidget.VPN_INDICATOR:
            return <VpnIndicator bar={bar}/>
        case BarWidget.RECORDING_INDICATOR:
            return <ScreenRecordingStopButton bar={bar}/>
        case BarWidget.MPRIS_CONTROLS:
            return <MprisControls vertical={isVertical}/>
        case BarWidget.MPRIS_TRACK_INFO:
            return <MprisTrackInfoBarWidget bar={bar} vertical={isVertical}/>
        case BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER:
            return <MprisPrimaryPlayerSwitcher bar={bar}/>
        case BarWidget.NOTIFICATION_HISTORY:
            return <NotificationButton bar={bar}/>
        case BarWidget.COLOR_PICKER:
            return <ColorPickerButton bar={bar}/>
    }
}
