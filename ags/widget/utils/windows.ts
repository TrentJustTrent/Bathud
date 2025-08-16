import App from "ags/gtk4/app"
import {SystemMenuWindowName} from "../systemMenu/SystemMenuWindow";
import {scrimsVisibleSetter} from "../common/Scrim";
import {CalendarWindowName} from "../calendar/Calendar";
import {AppLauncherWindowName} from "../appLauncher/AppLauncher";
import Astal from "gi://Astal?version=4.0";
import {ScreenshareWindowName} from "../screenshare/Screenshare";
import {ScreenshotWindowName} from "../screenshot/Screenshot";
import {ClipboardManagerWindowName} from "../clipboardManager/ClipboardManager";
// import {PolkitWindowName} from "../polkit/PolkitPopup";
import {NotificationHistoryWindowName} from "../notification/NotificationHistoryWindow";

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
            window.name === SystemMenuWindowName ||
            window.name === CalendarWindowName ||
            window.name === ScreenshareWindowName ||
            window.name === ScreenshotWindowName ||
            window.name === ClipboardManagerWindowName ||
            // window.name === PolkitWindowName ||
            window.name === NotificationHistoryWindowName
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