import {SystemMenuQuickActions} from "../../../config/schema/definitions/systemMenuWidgets";
import {Accessor, With} from "ags";
import AirplaneModeToggle from "./quickActions/AirplaneModeToggle";
import AppLauncherToggle from "./quickActions/AppLauncherToggle";
import BluetoothToggle from "./quickActions/BluetoothToggle";
import ClipboardManagerToggle from "./quickActions/ClipboardManagerToggle";
import ColorPicker from "./quickActions/ColorPicker";
import DoNotDisturb from "./quickActions/DoNotDisturb";
import Logout from "./quickActions/Logout";
import Lock from "./quickActions/Lock";
import NightlightToggle from "./quickActions/NightlightToggle";
import Restart from "./quickActions/Restart";
import ScreenshotToggle from "./quickActions/ScreenshotToggle";
import Shutdown from "./quickActions/Shutdown";

function getWidget(action: SystemMenuQuickActions) {
    switch (action) {
        case SystemMenuQuickActions.AIRPLANE_MODE_TOGGLE:
            return <AirplaneModeToggle/>
        case SystemMenuQuickActions.APP_LAUNCHER_TOGGLE:
            return <AppLauncherToggle/>
        case SystemMenuQuickActions.BLUETOOTH_TOGGLE:
            return <BluetoothToggle/>
        case SystemMenuQuickActions.CLIPBOARD_MANAGER_TOGGLE:
            return <ClipboardManagerToggle/>
        case SystemMenuQuickActions.COLOR_PICKER:
            return <ColorPicker/>
        case SystemMenuQuickActions.DO_NOT_DISTURB_TOGGLE:
            return <DoNotDisturb/>
        case SystemMenuQuickActions.LOGOUT:
            return <Logout/>
        case SystemMenuQuickActions.LOCK:
            return <Lock/>
        case SystemMenuQuickActions.NIGHTLIGHT_TOGGLE:
            return <NightlightToggle/>
        case SystemMenuQuickActions.RESTART:
            return <Restart/>
        case SystemMenuQuickActions.SCREENSHOT_TOGGLE:
            return <ScreenshotToggle/>
        case SystemMenuQuickActions.SHUTDOWN:
            return <Shutdown/>
    }
}

export default function (
    {
        actions
    }: {
        actions: Accessor<SystemMenuQuickActions[]>
    }
) {
    return <box>
        <With value={actions}>
            {actions => <box>
                {actions.map((action) => {
                    return getWidget(action)
                })}
                </box>
            }
        </With>
    </box>
}