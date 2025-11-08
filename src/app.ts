import App from "ags/gtk4/app"
import {ChargingAlertSound} from "./widgets/alerts/Alerts";
import {updateResponse, updateWindows} from "./widgets/screenshare/Screenshare";
import {decreaseVolume, increaseVolume, muteVolume} from "./widgets/utils/audio";
import Hyprland from "gi://AstalHyprland"
import {setThemeBasic} from "./config/theme";
import {closeIntegratedScreenshot, toggleIntegratedScreenshot} from "./widgets/screenshot/IntegratedScreenshot";
import {closeIntegratedAppLauncher, toggleIntegratedAppLauncher} from "./widgets/appLauncher/IntegratedAppLauncher";
import {closeIntegratedScreenshare, toggleIntegratedScreenshare} from "./widgets/screenshare/IntegratedScreenshare";
import {closeIntegratedMenu, toggleIntegratedMenu} from "./widgets/systemMenu/IntegratedMenu";
import {closeIntegratedCalendar, toggleIntegratedCalendar} from "./widgets/calendar/IntegratedCalendar";
import {
    closeIntegratedClipboardManager,
    toggleIntegratedClipboardManager
} from "./widgets/clipboardManager/IntegratedClipboardManager";
import {
    closeIntegratedNotificationsHistory,
    toggleIntegratedNotificationHistory
} from "./widgets/notification/IntegratedNotificationHistory";
import {customWidgetLabelSetters} from "./widgets/barWidgets/CustomWidget";
import {setWallpaper} from "./widgets/wallpaper/setWallpaper";
import {killOldMonitorWindows, spawnMonitorWindows} from "./widgets/utils/windows";
import {getHyprMonitorInfoById} from "./widgets/utils/monitors";

export let projectDir = ""

App.start({
    instanceName: "Bathud",
    css: "/tmp/Bathud/style.css",
    main(...args: Array<string>) {
        projectDir = args[0]
        setThemeBasic()

        const hyprland = Hyprland.get_default()

        ChargingAlertSound()

        hyprland.monitors.forEach((monitor) => {
            spawnMonitorWindows({
                id: monitor.id,
                name: monitor.name,
                width: monitor.width,
                height: monitor.height,
            })
        })

        hyprland.connect("monitor-added", (_: any, monitor: Hyprland.Monitor) => {
            if (monitor === undefined || monitor === null) return
            if (monitor.id === undefined || monitor.id === null) return

            getHyprMonitorInfoById(monitor.id)
                .then((hyprMonitorInfo) => {
                    if (hyprMonitorInfo === null) return
                    spawnMonitorWindows(hyprMonitorInfo)
                })
        });

        hyprland.connect("monitor-removed", () => {
            console.log(`Monitor removed`)
            killOldMonitorWindows();
        });
    },
    requestHandler(request: string[], res: (response: any) => void) {
        const command = request[0] ?? ""
        if (command.startsWith("custom")) {
            const widgetNumber = Number(request[1])
            if (isNaN(widgetNumber)) {
                res("invalid number")
                return
            }
            const setter = customWidgetLabelSetters.get(widgetNumber)
            if (setter === undefined) {
                res("widget number not in use")
                return
            }
            setter(request[2])
            res("applied custom label")
        } if (command.startsWith("volume-up")) {
            increaseVolume()
            res("volume up")
        } else if (command.startsWith("volume-down")) {
            decreaseVolume()
            res("volume down")
        } else if (command.startsWith("mute")) {
            muteVolume()
            res("mute")
        } else if (command === "appLauncher") {
            toggleIntegratedAppLauncher()
            res("app launcher toggled")
        } else if (command.startsWith("screenshare")) {
            updateWindows(command)
            updateResponse(res)
            toggleIntegratedScreenshare()
        } else if (command === "screenshot") {
            toggleIntegratedScreenshot()
            res("screenshot toggled")
        } else if (command === "menu") {
            toggleIntegratedMenu()
            res("menu toggled")
        } else if (command === "calendar") {
            toggleIntegratedCalendar()
            res("calendar toggled")
        } else if (command === "clipboard") {
            toggleIntegratedClipboardManager()
            res("clipboard toggled")
        } else if (command === "notification") {
            toggleIntegratedNotificationHistory()
            res("notifications toggled")
        } else if (command === "closeAll") {
            closeIntegratedAppLauncher()
            closeIntegratedCalendar()
            closeIntegratedClipboardManager()
            closeIntegratedMenu()
            closeIntegratedScreenshare()
            closeIntegratedNotificationsHistory()
            closeIntegratedScreenshot()
        } else if (command.startsWith("wallpaper")) {
            const path = request[1]
            setWallpaper(path)
                .finally(() => {
                    res("wallpaper set")
                })
        } else {
            res("command not found")
        }
    }
})
