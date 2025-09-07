import App from "ags/gtk4/app"
import {VolumeAlert, BrightnessAlert, ChargingAlertSound} from "./widget/alerts/Alerts";
import NotificationPopups from "./widget/notification/NotificationPopups";
import {updateResponse, updateWindows} from "./widget/screenshare/Screenshare";
import {decreaseVolume, increaseVolume, muteVolume} from "./widget/utils/audio";
import Scrim from "./widget/common/Scrim";
import Hyprland from "gi://AstalHyprland"
import {setThemeBasic} from "./config/theme";
import Frame from "./widget/frame/Frame";
import SpacerRight from "./widget/frame/backgroundSpacers/SpacerRight";
import SpacerLeft from "./widget/frame/backgroundSpacers/SpacerLeft";
import SpacerBottom from "./widget/frame/backgroundSpacers/SpacerBottom";
import SpacerTop from "./widget/frame/backgroundSpacers/SpacerTop";
import {toggleIntegratedScreenshot} from "./widget/screenshot/IntegratedScreenshot";
import {toggleIntegratedAppLauncher} from "./widget/appLauncher/IntegratedAppLauncher";
import {createRoot} from "ags";
import {toggleIntegratedScreenshare} from "./widget/screenshare/IntegratedScreenshare";
import {toggleIntegratedMenu} from "./widget/systemMenu/IntegratedMenu";
import {toggleIntegratedCalendar} from "./widget/calendar/IntegratedCalendar";
import {toggleIntegratedClipboardManager} from "./widget/clipboardManager/IntegratedClipboardManager";
import {toggleIntegratedNotificationHistory} from "./widget/notification/IntegratedNotificationHistory";
import {customWidgetLabelSetters} from "./widget/barWidgets/CustomWidget";
import Wallpaper from "./widget/wallpaper/Wallpaper";

export let projectDir = ""

App.start({
    instanceName: "OkPanel",
    css: "/tmp/OkPanel/style.css",
    main(...args: Array<string>) {
        projectDir = args[0]
        setThemeBasic()

        const hyprland = Hyprland.get_default()

        Frame()
        SpacerBottom()
        SpacerTop()
        SpacerRight()
        SpacerLeft()

        ChargingAlertSound()

        hyprland.monitors.map((monitor) => {
            Wallpaper(monitor)
            VolumeAlert(monitor)
            BrightnessAlert(monitor)
            NotificationPopups(monitor)
            Scrim(monitor)
        })

        hyprland.connect("monitor-added", (_, monitor) => {
            createRoot(() => {
                App.add_window(Wallpaper(monitor))
                App.add_window(VolumeAlert(monitor))
                App.add_window(BrightnessAlert(monitor))
                App.add_window(NotificationPopups(monitor))
                App.add_window(Scrim(monitor))
            })
        })
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
        } else {
            res("command not found")
        }
    }
})
