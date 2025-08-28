import App from "ags/gtk4/app"
import {scrimsVisibleSetter} from "../common/Scrim";
import {AppLauncherWindowName} from "../appLauncher/AppLauncher";
import Astal from "gi://Astal?version=4.0";
import {ScreenshareWindowName} from "../screenshare/Screenshare";
import {createRoot} from "ags";

const openedOneOffWindows: Astal.Window[] = []

export function toggleWindow(windowName: string) {
    const window = App.get_windows().find((window) => window.name === windowName)
    if (window !== undefined && !window.visible) {
        scrimsVisibleSetter(true)
        window.show()
    } else if (window?.visible) {
        window?.hide()
    }
}

export function hideAllWindows() {
    const windows = App.get_windows().filter((window) => {
        return window.name === AppLauncherWindowName ||
            window.name === ScreenshareWindowName
    })
    windows.forEach((window) => {
        window.hide()
    })
    openedOneOffWindows.forEach((window) => {
        window.close()
    })
    openedOneOffWindows.length = 0
    scrimsVisibleSetter(false)
}

export function registerWindow(window: Astal.Window) {
    openedOneOffWindows.push(window)
}

export function addWindowOneOff(createWindow: () => Astal.Window) {
    scrimsVisibleSetter(true)
    App.add_window(
        createRoot((dispose) => {
            const window = createWindow()
            registerWindow(window)
            window.connect("destroy", dispose)
            return window
        })
    )
}
