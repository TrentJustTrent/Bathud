import EndpointControls from "./widgets/EndpointControls";
import Wp from "gi://AstalWp"
import {bind, Variable} from "astal"
import {getMicrophoneIcon, getVolumeIcon} from "../utils/audio";
import PowerOptions from "./widgets/PowerOptions";
import MediaPlayers from "./widgets/MediaPlayers";
import NotificationHistory from "./widgets/NotificationHistory";
import NetworkControls from "./widgets/NetworkControls";
import BluetoothControls from "./widgets/BluetoothControls";
import LookAndFeelControls from "./widgets/LookAndFeelControls";
import {selectedBar, variableConfig} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {Bar} from "../../config/bar";
import PowerProfileControls from "./widgets/PowerProfileControls";
import {SystemMenuWidget} from "../../config/schema/definitions/systemMenu";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import Gizmos from "./widgets/Gizmos";

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
            case SystemMenuWidget.GIZMOS:
                return <Gizmos/>
        }
    })
}

export default function () {

    const topExpand = Variable.derive([
        selectedBar,
        variableConfig.verticalBar.centerWidgets,
        variableConfig.verticalBar.bottomWidgets,
    ], (bar, center, bottom) => {
        switch (bar) {
            case Bar.BOTTOM:
                return true
            case Bar.LEFT:
            case Bar.RIGHT:
                return center.includes(BarWidget.MENU)
                    || bottom.includes(BarWidget.MENU)
            default: return false
        }
    })

    const bottomExpand = Variable.derive([
        selectedBar,
        variableConfig.verticalBar.centerWidgets,
        variableConfig.verticalBar.topWidgets,
    ], (bar, center, top) => {
        switch (bar) {
            case Bar.TOP:
                return true
            case Bar.LEFT:
            case Bar.RIGHT:
                return center.includes(BarWidget.MENU)
                    || top.includes(BarWidget.MENU)
            default: return false
        }
    })

    const leftExpand = Variable.derive([
        selectedBar,
        variableConfig.horizontalBar.centerWidgets,
        variableConfig.horizontalBar.rightWidgets,
    ], (bar, center, right) => {
        switch (bar) {
            case Bar.RIGHT:
                return true
            case Bar.TOP:
            case Bar.BOTTOM:
                return center.includes(BarWidget.MENU)
                    || right.includes(BarWidget.MENU)
            default: return false
        }
    })

    const rightExpand = Variable.derive([
        selectedBar,
        variableConfig.horizontalBar.centerWidgets,
        variableConfig.horizontalBar.leftWidgets,
    ], (bar, center, left) => {
        switch (bar) {
            case Bar.LEFT:
                return true
            case Bar.TOP:
            case Bar.BOTTOM:
                return center.includes(BarWidget.MENU)
                    || left.includes(BarWidget.MENU)
            default: return false
        }
    })

    return <ScrimScrollWindow
        monitor={variableConfig.mainMonitor()}
        windowName={SystemMenuWindowName}
        topExpand={topExpand()}
        bottomExpand={bottomExpand()}
        leftExpand={leftExpand()}
        rightExpand={rightExpand()}
        contentWidth={400}
        width={variableConfig.horizontalBar.minimumWidth()}
        height={variableConfig.verticalBar.minimumHeight()}
        content={
            <box
                marginTop={20}
                marginStart={20}
                marginEnd={20}
                marginBottom={20}
                vertical={true}
                spacing={10}>
                {variableConfig.systemMenu.widgets().as((widgets) => {
                    return addWidgets(widgets)
                })}
            </box>
        }
    />
}