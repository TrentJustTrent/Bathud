import EndpointControls from "./widgets/EndpointControls";
import Wp from "gi://AstalWp"
import {getMicrophoneIcon, getVolumeIcon} from "../utils/audio";
import PowerOptions from "./widgets/PowerOptions";
import MediaPlayers from "./widgets/MediaPlayers";
import NotificationHistory from "./widgets/NotificationHistory";
import NetworkControls from "./widgets/NetworkControls";
import BluetoothControls from "./widgets/BluetoothControls";
import LookAndFeelControls from "./widgets/LookAndFeelControls";
import PowerProfileControls from "./widgets/PowerProfileControls";
import Toolbox from "./widgets/Toolbox";
import Clock from "./widgets/Clock";
import ClipboardManager from "./widgets/ClipboardManager";
import {startCliphist} from "../clipboardManager/ClipboardManager";
import ScreenRecording from "./widgets/ScreenRecording";
import {SystemMenuWidget} from "../../config/schema/definitions/systemMenuWidgets";
import {createBinding} from "ags";
import {Gtk} from "ags/gtk4";

const {audio} = Wp.get_default()!

export type SystemWidgetsJSX = {
    network: JSX.Element
    bluetooth: JSX.Element
    audioOut: JSX.Element
    audioIn: JSX.Element
    powerProfile: JSX.Element
    lookAndFeel: JSX.Element
    mpris: JSX.Element
    powerOptions: JSX.Element
    notificationHistory: JSX.Element
    toolbox: JSX.Element
    clock: JSX.Element
    clipboardManager: JSX.Element
    screenRecording: JSX.Element
}

// Creating new widgets to replace the old ones when switching configs
// is very cpu intensive and laggy.  This helps to create the widgets
// and keep them in memory so they can be reused.
export function createSystemWidgets(): SystemWidgetsJSX {
    return {
        network: <NetworkControls/>,
        bluetooth: <BluetoothControls/>,
        audioOut: <EndpointControls
            defaultEndpoint={audio.default_speaker}
            endpointsBinding={createBinding(audio, "speakers")}
            getIcon={getVolumeIcon}/>,
        audioIn: <EndpointControls
            defaultEndpoint={audio.default_microphone}
            endpointsBinding={createBinding(audio, "microphones")}
            getIcon={getMicrophoneIcon}/>,
        powerProfile: <PowerProfileControls/>,
        lookAndFeel: <LookAndFeelControls/>,
        mpris: <MediaPlayers/>,
        powerOptions: <PowerOptions/>,
        notificationHistory: <NotificationHistory/>,
        toolbox: <Toolbox/>,
        clock: <Clock/>,
        clipboardManager: <ClipboardManager/>,
        screenRecording: <ScreenRecording/>,
    }
}

export function addSystemMenuWidgets(
    widgets: SystemMenuWidget[],
    jsxWidgets: SystemWidgetsJSX,
): Gtk.Widget[] {
    return widgets.map((widget) => {
        switch (widget) {
            case SystemMenuWidget.NETWORK:
                return jsxWidgets.network as Gtk.Widget
            case SystemMenuWidget.NOTIFICATION_HISTORY:
                return jsxWidgets.notificationHistory as Gtk.Widget
            case SystemMenuWidget.BLUETOOTH:
                return jsxWidgets.bluetooth as Gtk.Widget
            case SystemMenuWidget.CLIPBOARD_MANAGER:
                startCliphist()
                return jsxWidgets.clipboardManager as Gtk.Widget
            case SystemMenuWidget.CLOCK:
                return jsxWidgets.clock as Gtk.Widget
            case SystemMenuWidget.AUDIO_OUT:
                return jsxWidgets.audioOut as Gtk.Widget
            case SystemMenuWidget.AUDIO_IN:
                return jsxWidgets.audioIn as Gtk.Widget
            case SystemMenuWidget.LOOK_AND_FEEL:
                return jsxWidgets.lookAndFeel as Gtk.Widget
            case SystemMenuWidget.MPRIS_PLAYERS:
                return jsxWidgets.mpris as Gtk.Widget
            case SystemMenuWidget.POWER_PROFILE:
                return jsxWidgets.powerProfile as Gtk.Widget
            case SystemMenuWidget.POWER_OPTIONS:
                return jsxWidgets.powerOptions as Gtk.Widget
            case SystemMenuWidget.TOOLBOX:
                return jsxWidgets.toolbox as Gtk.Widget
            case SystemMenuWidget.SCREEN_RECORDING_CONTROLS:
                return jsxWidgets.screenRecording as Gtk.Widget
        }
    })
}
