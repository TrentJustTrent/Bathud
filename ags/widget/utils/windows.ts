import {App} from "astal/gtk4";
import {SystemMenuWindowName} from "../systemMenu/SystemMenuWindow";
import {scrimsVisible} from "../common/Scrim";
import {CalendarWindowName} from "../calendar/Calendar";
import {AppLauncherWindowName} from "../appLauncher/AppLauncher";
import {ScreenshareWindowName} from "../screenshare/Screenshare";
import {ScreenshotWindowName} from "../screenshot/Screenshot";
import {ClipboardManagerWindowName} from "../clipboardManager/ClipboardManager";

export function toggleWindow(windowName: string) {
    const window = App.get_windows().find((window) => window.name === windowName)
    if (window !== undefined && !window.visible) {
        scrimsVisible.set(true)
        window.show()
    } else if (window?.visible) {
        window?.hide()
    }
}

export function hideAllWindows() {
    const windows = App.get_windows().filter((window) => {
        return window.name === SystemMenuWindowName ||
            window.name === CalendarWindowName ||
            window.name === AppLauncherWindowName ||
            window.name === ScreenshareWindowName ||
            window.name === ScreenshotWindowName ||
            window.name === ClipboardManagerWindowName
    })
    windows.forEach((window) => {
        window.hide()
    })
    scrimsVisible.set(false)
}