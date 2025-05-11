import {Gtk} from "astal/gtk4"
import {execAsync} from "astal/process"
import {config} from "../../../config/config";
import {hideAllWindows} from "../../utils/windows";
import OkButton, {OkButtonSize} from "../../common/OkButton";
import ConfirmationDialog from "../../common/ConfirmationDialog";

export default function () {
    return <box
        vertical={false}
        halign={Gtk.Align.CENTER}
        spacing={12}>
        <OkButton
            size={OkButtonSize.XL}
            label="󰍃"
            offset={0}
            onClicked={() => {
                hideAllWindows()
                if (config.systemCommands.logoutConfirmationEnabled) {
                    ConfirmationDialog(
                        "Are you sure you want to logout?",
                        "Logout",
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

            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={2}
            onClicked={() => {
                hideAllWindows()
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
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label=""
            offset={0}
            onClicked={() => {
                hideAllWindows()
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
            }}/>
        <OkButton
            size={OkButtonSize.XL}
            label="⏻"
            offset={2}
            onClicked={() => {
                hideAllWindows()
                if (config.systemCommands.shutdownConfirmationEnabled) {
                    ConfirmationDialog(
                        "Are you sure you want to shutdown?",
                        "Shutdown",
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
            }}/>
    </box>
}