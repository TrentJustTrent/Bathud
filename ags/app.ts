import App from "ags/gtk4/app"
import {VolumeAlert, BrightnessAlert, ChargingAlertSound} from "./widget/alerts/Alerts";
import NotificationPopups from "./widget/notification/NotificationPopups";
import Screenshare, {ScreenshareWindowName, updateResponse, updateWindows} from "./widget/screenshare/Screenshare";
import {decreaseVolume, increaseVolume, muteVolume} from "./widget/utils/audio";
import Scrim from "./widget/common/Scrim";
import {toggleWindow} from "./widget/utils/windows";
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
        Screenshare()

        hyprland.monitors.map((monitor) => {
            VolumeAlert(monitor)
            BrightnessAlert(monitor)
            NotificationPopups(monitor)
            Scrim(monitor)
        })

        hyprland.connect("monitor-added", (_, monitor) => {
            createRoot(() => {
                App.add_window(VolumeAlert(monitor))
                App.add_window(BrightnessAlert(monitor))
                App.add_window(NotificationPopups(monitor))
                App.add_window(Scrim(monitor))
            })
        })
    },
    requestHandler(request: string, res: (response: any) => void) {
        if (request.startsWith("volume-up")) {
            increaseVolume()
            res("volume up")
        } else if (request.startsWith("volume-down")) {
            decreaseVolume()
            res("volume down")
        } else if (request.startsWith("mute")) {
            muteVolume()
            res("mute")
        } else if (request === "appLauncher") {
            toggleIntegratedAppLauncher()
            res("app launcher toggled")
        } else if (request.startsWith("screenshare")) {
            updateWindows(request)
            updateResponse(res)
            toggleWindow(ScreenshareWindowName)
        } else if (request === "screenshot") {
            toggleIntegratedScreenshot()
            res("screenshot toggled")
        } else {
            res("command not found")
        }
    }
})
