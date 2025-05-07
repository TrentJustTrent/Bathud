import {config, selectedBar} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {Bar} from "../../config/bar";
import NotificationHistory from "../systemMenu/NotificationHistory";


import {BarWidget} from "../../config/schema/definitions/barWidgets";

export const NotificationHistoryWindowName = "notificationHistoryWindow"

export default function () {
    return <ScrimScrollWindow
        monitor={config.mainMonitor}
        windowName={NotificationHistoryWindowName}
        topExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.BOTTOM:
                    return true
                case Bar.LEFT:
                case Bar.RIGHT:
                    return config.verticalBar.centerWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                        || config.verticalBar.bottomWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                default: return false
            }
        })}
        bottomExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.TOP:
                    return true
                case Bar.LEFT:
                case Bar.RIGHT:
                    return config.verticalBar.centerWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                        || config.verticalBar.topWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                default: return false
            }
        })}
        leftExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.RIGHT:
                    return true
                case Bar.TOP:
                case Bar.BOTTOM:
                    return config.horizontalBar.centerWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                        || config.horizontalBar.rightWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                default: return false
            }
        })}
        rightExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.LEFT:
                    return true
                case Bar.TOP:
                case Bar.BOTTOM:
                    return config.horizontalBar.centerWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
                        || config.horizontalBar.leftWidgets.includes(BarWidget.NOTIFICATION_HISTORY)
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
                marginBottom={20}>
                <NotificationHistory/>
            </box>
        }/>
}