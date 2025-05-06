import {App} from "astal/gtk4"
import Calendar from "./widget/calendar/Calendar"
import SystemMenuWindow from "./widget/systemMenu/SystemMenuWindow";
import {BrightnessAlert, ChargingAlertSound, VolumeAlert} from "./widget/alerts/Alerts";
import NotificationPopups from "./widget/notification/NotificationPopups";
import AppLauncher, {AppLauncherWindowName} from "./widget/appLauncher/AppLauncher";
import Screenshot, {ScreenshotWindowName} from "./widget/screenshot/Screenshot";
import Screenshare, {ScreenshareWindowName, updateResponse, updateWindows} from "./widget/screenshare/Screenshare";
import VerticalBar from "./widget/bar/VerticalBar";
import HorizontalBar from "./widget/bar/HorizontalBar";
import {decreaseVolume, increaseVolume, muteVolume} from "./widget/utils/audio";
import {parseTheme} from "./config/themeParser";
import Scrim from "./widget/common/Scrim";
import {toggleWindow} from "./widget/utils/windows";
import Hyprland from "gi://AstalHyprland"
import {restoreSavedState, setThemeBasic} from "./config/cachedStates";
import {setHomeDir, setProjectDir} from "./config/config";
import ClipboardManager from "./widget/clipboardManager/ClipboardManager";
import {cavaInstances} from "./widget/cava/cavaInstances";

const hyprland = Hyprland.get_default()

App.start({
    instanceName: "OkPanel",
    css: "/tmp/OkPanel/style.css",
    main(...args: Array<string>) {
        setProjectDir(args[0])
        setHomeDir(args[1])
        restoreSavedState()

        VerticalBar()
        HorizontalBar()
        Calendar()
        SystemMenuWindow()
        ChargingAlertSound()
        AppLauncher()
        Screenshot()
        Screenshare()
        ClipboardManager()

        hyprland.monitors.map((monitor) => {
            VolumeAlert(monitor)
            BrightnessAlert(monitor)
            NotificationPopups(monitor)
            Scrim(monitor)
        })

        hyprland.connect("monitor-added", (_, monitor) => {
            App.add_window(VolumeAlert(monitor))
            App.add_window(BrightnessAlert(monitor))
            App.add_window(NotificationPopups(monitor))
            App.add_window(Scrim(monitor))
        })
    },
    requestHandler(request: string, res: (response: any) => void) {
        if (request.startsWith("theme")) {
            const theme = parseTheme(request)
            setThemeBasic(theme)
            res("ags theme applied")
        } else if (request === "appLauncher") {
            toggleWindow(AppLauncherWindowName)
            res("app launcher toggled")
        } else if (request === "screenshot") {
            toggleWindow(ScreenshotWindowName)
            res("screenshot toggled")
        } else if (request.startsWith("screenshare")) {
            updateWindows(request)
            updateResponse(res)
            toggleWindow(ScreenshareWindowName)
        } else if (request.startsWith("volume-up")) {
            increaseVolume()
            res("volume up")
        } else if (request.startsWith("volume-down")) {
            decreaseVolume()
            res("volume down")
        } else if (request.startsWith("mute")) {
            muteVolume()
            res("mute")
        } else if (request.startsWith("cleanup")) {
            console.log("Cleanup request received, cleaning up...");
            cleanup()
            res("Clean up successful")
        } else {
            res("command not found")
        }
    }
})

export function cleanup() {
    console.log("Cleaning up")
    cavaInstances.forEach((cava) => {
        cava.set_active(false)
    })

    console.log("Finished cleaning up")
}
