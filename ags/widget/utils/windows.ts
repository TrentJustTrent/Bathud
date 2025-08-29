import App from "ags/gtk4/app"
import {scrimsVisibleSetter} from "../common/Scrim";
import Astal from "gi://Astal?version=4.0";
import {createRoot} from "ags";

const openedOneOffWindows: Astal.Window[] = []

export function hideAllWindows() {
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
