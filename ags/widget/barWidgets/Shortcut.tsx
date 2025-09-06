import OkButton from "../common/OkButton";
import {variableConfig} from "../../config/config";
import {Bar} from "../../config/bar";
import {Accessor, createBinding, createComputed, createRoot} from "ags";
import {getHPadding, getVPadding} from "./BarWidgets";
import {Gdk, Gtk} from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import {launchApp} from "../utils/launch";
import {timeout, Timer} from "ags/time";
import Gio from "gi://Gio?version=2.0";
import GLib from "gi://GLib?version=2.0";

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
            hpadding={getHPadding(bar)}
            vpadding={getVPadding(bar)}
            labelCss={[`barShortcut${shortcutNumber}Foreground`]}
            backgroundCss={[`barShortcut${shortcutNumber}Background`]}
            //@ts-ignore
            offset={variableConfig.barWidgets[`shortcut${shortcutNumber}`].iconOffset.asAccessor()}
            label={label}
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
                onRightClick: ({self, x, y}) => {
                    createRoot((dispose) => {
                        // @ts-ignore
                        const clazz: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].class.get()
                        let clients = hyprland
                            .clients
                            .filter((it) => it.class === clazz)

                        // 1) Build a menu model
                        const model = new Gio.Menu();
                        model.append("Launch", "main.launch")
                        model.append("New Window", "main.new-window");
                        model.append("Quit", "main.quit");

                        const pop = Gtk.PopoverMenu.new_from_model(model);
                        pop.set_has_arrow(false);

                        // 2) Provide the actions on the popover (prefix "dock")
                        const group = new Gio.SimpleActionGroup();

                        if (clients.length === 0) {
                            // No opened clients
                            const newWindowAction = new Gio.SimpleAction({ name: "launch" });
                            newWindowAction.connect("activate", () => {
                                pop.popdown();
                                // @ts-ignore
                                const command: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].launch.get()
                                if (command !== "") {
                                    launchApp([command])
                                }
                            });
                            group.add_action(newWindowAction);

                            const root = new Gio.Menu();
                            root.append("Launch", "main.launch")
                            pop.set_menu_model(root);
                        } else {
                            // Has opened clients
                            const newWindowAction = new Gio.SimpleAction({name: "new-window"});
                            newWindowAction.connect("activate", () => {
                                pop.popdown();
                                // @ts-ignore
                                const command: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].newWindow.get()
                                if (command !== "") {
                                    launchApp([command])
                                }
                            });
                            group.add_action(newWindowAction);

                            const quitAction = new Gio.SimpleAction({name: "quit"});
                            quitAction.connect("activate", () => {
                                pop.popdown();
                                // @ts-ignore
                                const clazz: string = variableConfig.barWidgets[`shortcut${shortcutNumber}`].class.get()
                                hyprland.clients.filter((it) => it.class === clazz).forEach((it) => it.kill())
                            });
                            group.add_action(quitAction);

                            const root = new Gio.Menu();
                            root.append("New Window", "main.new-window");
                            root.append("Quit", "main.quit");
                            pop.set_menu_model(root);
                        }

                        // Attach the group to the popover under the "main" prefix
                        // (GTK will search the popover, then its parents, for "main.*")
                        pop.insert_action_group?.("main", group);

                        pop.set_parent(self);

                        const rect = new Gdk.Rectangle({ x: Math.round(x), y: Math.round(y), width: 1, height: 1 });
                        pop.set_pointing_to?.(rect);

                        pop.connect("closed", () => {
                            dispose();
                        });

                        pop.popup();
                    });
                }
            }}/>
    </overlay>
}