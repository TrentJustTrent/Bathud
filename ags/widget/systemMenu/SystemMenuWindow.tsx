import EndpointControls from "./EndpointControls";
import Wp from "gi://AstalWp"
import {bind} from "astal"
import {getMicrophoneIcon, getVolumeIcon} from "../utils/audio";
import PowerOptions from "./PowerOptions";
import MediaPlayers from "./MediaPlayers";
import NotificationHistory from "./NotificationHistory";
import NetworkControls from "./NetworkControls";
import BluetoothControls from "./BluetoothControls";
import LookAndFeelControls from "./LookAndFeelControls";
import {config, selectedBar} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {Bar} from "../../config/bar";
import PowerProfileControls from "./PowerProfileControls";

import {BarWidget} from "../../config/schema/definitions/bars";
import {SystemMenuWidget} from "../../config/schema/definitions/systemMenu";

export const SystemMenuWindowName = "systemMenuWindow"

const {audio} = Wp.get_default()!

export function addWidgets(widgets: SystemMenuWidget[]) {
    return widgets.map((widget) => {
        switch (widget) {
            case SystemMenuWidget.NETWORK:
                return <NetworkControls/>
            case SystemMenuWidget.BLUETOOTH:
                return <BluetoothControls/>
            case SystemMenuWidget.AUDIO_OUT:
                return <EndpointControls
                    defaultEndpoint={audio.default_speaker}
                    endpointsBinding={bind(audio, "speakers")}
                    getIcon={getVolumeIcon}/>
            case SystemMenuWidget.AUDIO_IN:
                return <EndpointControls
                    defaultEndpoint={audio.default_microphone}
                    endpointsBinding={bind(audio, "microphones")}
                    getIcon={getMicrophoneIcon}/>
            case SystemMenuWidget.POWER_PROFILE:
                return <PowerProfileControls/>
            case SystemMenuWidget.LOOK_AND_FEEL:
                return <LookAndFeelControls/>
            case SystemMenuWidget.MPRIS_PLAYERS:
                return <MediaPlayers/>
            case SystemMenuWidget.POWER_OPTIONS:
                return <PowerOptions/>
            case SystemMenuWidget.NOTIFICATION_HISTORY:
                return <NotificationHistory/>
        }
    })
}

export default function () {
    return <ScrimScrollWindow
        monitor={config.mainMonitor}
        windowName={SystemMenuWindowName}
        topExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.BOTTOM:
                    return true
                case Bar.LEFT:
                case Bar.RIGHT:
                    return config.verticalBar.centerWidgets.includes(BarWidget.MENU)
                        || config.verticalBar.bottomWidgets.includes(BarWidget.MENU)
                default: return false
            }
        })}
        bottomExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.TOP:
                    return true
                case Bar.LEFT:
                case Bar.RIGHT:
                    return config.verticalBar.centerWidgets.includes(BarWidget.MENU)
                        || config.verticalBar.topWidgets.includes(BarWidget.MENU)
                default: return false
            }
        })}
        leftExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.RIGHT:
                    return true
                case Bar.TOP:
                case Bar.BOTTOM:
                    return config.horizontalBar.centerWidgets.includes(BarWidget.MENU)
                        || config.horizontalBar.rightWidgets.includes(BarWidget.MENU)
                default: return false
            }
        })}
        rightExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.LEFT:
                    return true
                case Bar.TOP:
                case Bar.BOTTOM:
                    return config.horizontalBar.centerWidgets.includes(BarWidget.MENU)
                        || config.horizontalBar.leftWidgets.includes(BarWidget.MENU)
                default: return false
            }
        })}
        contentWidth={400}
        width={config.horizontalBar.minimumWidth}
        height={config.verticalBar.minimumHeight}
        content={
            <box
                marginTop={20}
                marginStart={20}
                marginEnd={20}
                marginBottom={20}
                vertical={true}
                spacing={10}>
                {addWidgets(config.systemMenu.widgets)}
            </box>
        }
    />
}