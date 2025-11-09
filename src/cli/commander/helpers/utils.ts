/**
 * Central error handling utilities
 */

import { closeIntegratedAppLauncher, toggleIntegratedAppLauncher } from "../../../widgets/appLauncher/IntegratedAppLauncher";
import { closeIntegratedClipboardManager, toggleIntegratedClipboardManager } from "../../../widgets/clipboardManager/IntegratedClipboardManager";
import { closeIntegratedMiscellaneous, toggleIntegratedMiscellaneous } from "../../../widgets/miscellaneous/IntegratedMiscellaneous";
import { closeIntegratedNotificationsHistory, toggleIntegratedNotificationHistory } from "../../../widgets/notification/IntegratedNotificationHistory";
import { closeIntegratedScreenshare, toggleIntegratedScreenshare } from "../../../widgets/screenshare/IntegratedScreenshare";
import { closeIntegratedScreenshot,toggleIntegratedScreenshot } from "../../../widgets/screenshot/IntegratedScreenshot";
import { closeIntegratedMenu, toggleIntegratedMenu } from "../../../widgets/systemMenu/IntegratedMenu";

/**
 * Handles errors by throwing a new Error with a message
 * @param error - The error to handle
 * @throws Throws a new error with the provided message or a default message
 */
export function errorHandler(error: unknown): never {
    if (error instanceof Error) {
        throw new Error(error.message);
    }

    throw new Error(String(error));
}
function toggleAll() {
    toggleIntegratedAppLauncher();
    toggleIntegratedScreenshot();
    toggleIntegratedScreenshare();
    toggleIntegratedMenu();
    toggleIntegratedMiscellaneous();
    toggleIntegratedMiscellaneous();
    toggleIntegratedClipboardManager();
    toggleIntegratedNotificationHistory();
};
function closeAll() {
    closeIntegratedAppLauncher();
    closeIntegratedScreenshot();
    closeIntegratedScreenshare();
    closeIntegratedMenu();
    closeIntegratedMiscellaneous();
    closeIntegratedMiscellaneous();
    closeIntegratedClipboardManager();
    closeIntegratedNotificationsHistory();
};

export const windowToggles = new Map();
windowToggles.set("applauncher", toggleIntegratedAppLauncher);
windowToggles.set("screenshot", toggleIntegratedScreenshot);
windowToggles.set("screenshare", toggleIntegratedScreenshare);
windowToggles.set("menu", toggleIntegratedMenu);
windowToggles.set("verse", toggleIntegratedMiscellaneous);
windowToggles.set("timer", toggleIntegratedMiscellaneous);
windowToggles.set("clipboardmanager", toggleIntegratedClipboardManager);
windowToggles.set("notificationhistory", toggleIntegratedNotificationHistory);
windowToggles.set("all",toggleAll)


export const windowClose = new Map();
windowClose.set("applauncher", closeIntegratedAppLauncher);
windowClose.set("screenshot", closeIntegratedScreenshot);
windowClose.set("screenshare", closeIntegratedScreenshare);
windowClose.set("menu", closeIntegratedMenu);
windowClose.set("verse", closeIntegratedMiscellaneous);
windowClose.set("timer", closeIntegratedMiscellaneous);
windowClose.set("clipboardmanager", closeIntegratedClipboardManager);
windowClose.set("notificationhistory", closeIntegratedNotificationsHistory);
windowClose.set("all", closeAll)
