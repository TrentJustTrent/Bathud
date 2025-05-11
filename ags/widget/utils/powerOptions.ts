import {config} from "../../config/config";
import ConfirmationDialog from "../common/ConfirmationDialog";
import {execAsync} from "astal/process";

export function logout() {
    if (config.systemCommands.logoutConfirmationEnabled) {
        ConfirmationDialog(
            "Are you sure you want to log out?",
            "Log out",
            "Cancel",
            () => {
                execAsync(config.systemCommands.logout)
                    .catch((error) => {
                        console.error(error)
                    })
            }
        )
    } else {
        execAsync(config.systemCommands.logout)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function lock() {
    if (config.systemCommands.lockConfirmationEnabled) {
        ConfirmationDialog(
            "Are you sure you want to lock the device?",
            "Lock",
            "Cancel",
            () => {
                execAsync(config.systemCommands.lock)
                    .catch((error) => {
                        console.error(error)
                    })
            }
        )
    } else {
        execAsync(config.systemCommands.lock)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function restart() {
    if (config.systemCommands.restartConfirmationEnabled) {
        ConfirmationDialog(
            "Are you sure you want to restart?",
            "Restart",
            "Cancel",
            () => {
                execAsync(config.systemCommands.restart)
                    .catch((error) => {
                        console.error(error)
                    })
            }
        )
    } else {
        execAsync(config.systemCommands.restart)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function shutdown() {
    if (config.systemCommands.shutdownConfirmationEnabled) {
        ConfirmationDialog(
            "Are you sure you want to shut down?",
            "Shut down",
            "Cancel",
            () => {
                execAsync(config.systemCommands.shutdown)
                    .catch((error) => {
                        console.error(error)
                    })
            }
        )
    } else {
        execAsync(config.systemCommands.shutdown)
            .catch((error) => {
                console.error(error)
            })
    }
}