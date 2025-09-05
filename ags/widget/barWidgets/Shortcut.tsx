import OkButton from "../common/OkButton";
import {variableConfig} from "../../config/config";
import {Bar} from "../../config/bar";
import {Accessor, createBinding, createComputed} from "ags";
import {getHPadding, getVPadding} from "./BarWidgets";
import {Gtk} from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import {launchApp} from "../utils/launch";
import {timeout, Timer} from "ags/time";

function getIndicatorHAlign(bar: Bar) {
    switch (bar) {
        case Bar.LEFT:
            return Gtk.Align.START
        case Bar.RIGHT:
            return Gtk.Align.END
        case Bar.TOP:
        case Bar.BOTTOM:
            return Gtk.Align.CENTER
    }
}

function getIndicatorVAlign(bar: Bar) {
    switch (bar) {
        case Bar.LEFT:
        case Bar.RIGHT:
            return Gtk.Align.CENTER
        case Bar.TOP:
            return Gtk.Align.START
        case Bar.BOTTOM:
            return Gtk.Align.END
    }
}

export default function (
    {
        shortcutNumber,
        bar,
    }: {
        shortcutNumber: number
        bar: Bar,
    }
) {
    const hyprland = AstalHyprland.get_default()
    // @ts-ignore
    const label: Accessor<string> = variableConfig.barWidgets[`shortcut${shortcutNumber}`].icon.asAccessor()

    const indicatorVisible = createComputed([
        createBinding(hyprland, "clients"),
        // @ts-ignore
        variableConfig.barWidgets[`shortcut${shortcutNumber}`].class.asAccessor()
    ], (clients: AstalHyprland.Client[], clazz: string) => {
        return clients.filter((it) => it.class === clazz).length > 0
    })

    let cycleClientsTimer: Timer | null = null
    let lastClientFocusId: number | null = null

    return <overlay
        $={(self) => {
            self.add_overlay(
                <box
                    canTarget={false}
                    canFocus={false}
                    hexpand={false}
                    vexpand={false}
                    visible={indicatorVisible}
                    cssClasses={[`barShortcut${shortcutNumber}Indicator`]}
                    halign={getIndicatorHAlign(bar)}
                    valign={getIndicatorVAlign(bar)}
                    widthRequest={4}
                    heightRequest={4}
                    marginStart={6}
                    marginBottom={4}
                    marginEnd={6}
                    marginTop={4}
                /> as Gtk.Box
            )
        }}>
        <OkButton
            clickHandlers={{
                onLeftClick: () => {
                    console.log("click")
                    // @ts-ignore
                    const clazz: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].class.get()
                    let clients = hyprland
                        .clients
                        .filter((it) => it.class === clazz)
                        .sort((a, b) => a.focusHistoryId - b.focusHistoryId)

                    console.log(`clients: ${clients.map((it) => it.focusHistoryId)}`)
                    console.log(`lastClientFocusId: ${lastClientFocusId}`)

                    if (clients.length === 0) {
                        // If there are no clients open, launch one
                        // @ts-ignore
                        const command: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].launch.get()
                        if (command !== "") {
                            launchApp([command])
                        }
                    } else {

                        // Cycle through clients if we focused recently
                        if (cycleClientsTimer !== null && lastClientFocusId !== null) {
                            cycleClientsTimer.cancel()

                            clients = clients
                                .filter((it) => it.focusHistoryId > lastClientFocusId!)

                            if (clients.length === 0) {
                                clients = hyprland
                                    .clients
                                    .filter((it) => it.class === clazz)
                                    .sort((a, b) => a.focusHistoryId - b.focusHistoryId)
                            }

                            const lastFocusedClient = clients[0]
                            const workspace = lastFocusedClient.get_workspace()
                            if (workspace.id !== hyprland.get_focused_workspace().id) {
                                workspace.focus()
                            }
                            lastFocusedClient.focus()
                            lastClientFocusId = lastFocusedClient.focusHistoryId
                            if (clients.length > 1) {
                                cycleClientsTimer = timeout(5000, () => {
                                    cycleClientsTimer = null
                                })
                            }

                            return
                        }

                        // If we are not cycling yet
                        // Focus on the most recently created client in the current workspace
                        const focusedWorkspace = hyprland.get_focused_workspace()
                        let clientsOnFocusedWorkspace = focusedWorkspace
                            .clients
                            .filter((it) => it.class === clazz)
                            .sort((a, b) => a.focusHistoryId - b.focusHistoryId)

                        if (clientsOnFocusedWorkspace.length !== 0) {
                            const lastFocusedClient = clients[0]
                            lastFocusedClient.focus()
                            lastClientFocusId = lastFocusedClient.focusHistoryId
                            if (clients.length > 1) {
                                cycleClientsTimer = timeout(5000, () => {
                                    cycleClientsTimer = null
                                })
                            }
                            return
                        }

                        // If this workspace has no clients
                        // Focus on the most recently created client
                        const lastFocusedClient = clients[0]
                        const workspace = lastFocusedClient.get_workspace()
                        if (workspace.id !== hyprland.get_focused_workspace().id) {
                            workspace.focus()
                        }
                        lastFocusedClient.focus()
                        lastClientFocusId = lastFocusedClient.focusHistoryId
                        if (clients.length > 1) {
                            cycleClientsTimer = timeout(5000, () => {
                                cycleClientsTimer = null
                            })
                        }
                    }
                },
                onMiddleClick: () => {
                    // @ts-ignore
                    const command: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].newWindow.get()
                    if (command !== "") {
                        launchApp([command])
                    }
                },
                onRightClick: () => {
                    console.log("right click")
                }
            }}
            hpadding={getHPadding(bar)}
            vpadding={getVPadding(bar)}
            labelCss={[`barShortcut${shortcutNumber}Foreground`]}
            backgroundCss={[`barShortcut${shortcutNumber}Background`]}
            label={label}/>
    </overlay>
}