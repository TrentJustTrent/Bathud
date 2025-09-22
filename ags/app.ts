import App from "ags/gtk4/app"
import {ChargingAlertSound} from "./widget/alerts/Alerts";
import {updateResponse, updateWindows} from "./widget/screenshare/Screenshare";
import {decreaseVolume, increaseVolume, muteVolume} from "./widget/utils/audio";
import Hyprland from "gi://AstalHyprland"
import {setThemeBasic} from "./config/theme";
import Frame from "./widget/frame/Frame";
import SpacerRight from "./widget/frame/backgroundSpacers/SpacerRight";
import SpacerLeft from "./widget/frame/backgroundSpacers/SpacerLeft";
import SpacerBottom from "./widget/frame/backgroundSpacers/SpacerBottom";
import SpacerTop from "./widget/frame/backgroundSpacers/SpacerTop";
import {toggleIntegratedScreenshot} from "./widget/screenshot/IntegratedScreenshot";
import {toggleIntegratedAppLauncher} from "./widget/appLauncher/IntegratedAppLauncher";
import {toggleIntegratedScreenshare} from "./widget/screenshare/IntegratedScreenshare";
import {toggleIntegratedMenu} from "./widget/systemMenu/IntegratedMenu";
import {toggleIntegratedMisc} from "./widget/miscellaneous/IntegratedMisc";
import {toggleIntegratedClipboardManager} from "./widget/clipboardManager/IntegratedClipboardManager";
import {toggleIntegratedNotificationHistory} from "./widget/notification/IntegratedNotificationHistory";
import {customWidgetLabelSetters} from "./widget/barWidgets/CustomWidget";
import {setWallpaper} from "./widget/wallpaper/setWallpaper";
import {killOldMonitorWindows, spawnMonitorWindows} from "./widget/utils/windows";
//import { runCLI } from "./cli/commander";

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

        hyprland.monitors.forEach(spawnMonitorWindows);

        hyprland.connect("monitor-added", (_: any, monitor: any) => {
            spawnMonitorWindows(monitor);
        });

        hyprland.connect("monitor-removed", () => {
            killOldMonitorWindows();
        });
    },
    //requestHandler: (request: string, res: (response: unknown) => void) {
    //  runCLI(request, res)
    // },
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
            toggleIntegratedMisc()
            res("calendar toggled")
        } else if (command === "clipboard") {
            toggleIntegratedClipboardManager()
            res("clipboard toggled")
        } else if (command === "notification") {
            toggleIntegratedNotificationHistory()
            res("notifications toggled")
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
