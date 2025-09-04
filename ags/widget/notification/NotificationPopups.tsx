import {Astal, Gtk} from "ags/gtk4"
import Notification from "./Notification"
import {variableConfig} from "../../config/config";
import Hyprland from "gi://AstalHyprland"
import {NotificationsPosition} from "../../config/schema/definitions/notifications";
import GLib from "gi://GLib?version=2.0";
import {createState, For, onCleanup} from "ags";
import AstalNotifd from "gi://AstalNotifd?version=0.1";

// see comment below in constructor
const TIMEOUT_DELAY = 7_000

export default function NotificationPopups(monitor: Hyprland.Monitor): Astal.Window {
    const notifd = AstalNotifd.get_default()

    const [notifications, setNotifications] = createState(
        new Array<AstalNotifd.Notification>(),
    )

    const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
        const notification = notifd.get_notification(id)

        if (replaced && notifications.get().some((n) => n.id === id)) {
            setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)))
        } else {
            setNotifications((ns) => [notification, ...ns])
        }
    })

    const resolvedHandler = notifd.connect("resolved", (_, id) => {
        setNotifications((ns) => ns.filter((n) => n.id !== id))
    })

    onCleanup(() => {
        notifd.disconnect(notifiedHandler)
        notifd.disconnect(resolvedHandler)
    })

    return <window
        namespace={"okpanel-notifications"}
        visible={notifications.as((values) => {
            return values.length !== 0
        })}
        cssClasses={["NotificationPopups"]}
        monitor={monitor.id}
        exclusivity={variableConfig.notifications.respectExclusive.asAccessor().as((exclusive) => {
            if (exclusive) {
                return Astal.Exclusivity.NORMAL
            } else {
                return Astal.Exclusivity.IGNORE
            }
        })}
        layer={Astal.Layer.OVERLAY}
        anchor={variableConfig.notifications.position.asAccessor().as((position) => {
            if (position === NotificationsPosition.LEFT) {
                return Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT
            } else if (position === NotificationsPosition.RIGHT) {
                return Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT
            } else {
                return Astal.WindowAnchor.TOP
            }
        })}>
        <box
            orientation={Gtk.Orientation.VERTICAL}>
            <For each={notifications} id={(it) => it.id}>
                {(notification: AstalNotifd.Notification) => {
                    let hideTimeout: GLib.Source | null = null
                    return <Notification
                        setup={(self) => {
                            hideTimeout = setTimeout(() => {
                                setNotifications((ns) => ns.filter((it) => it.id !== notification.id))
                                hideTimeout?.destroy()
                                hideTimeout = null
                            }, TIMEOUT_DELAY)
                            const motion = new Gtk.EventControllerMotion();
                            motion.connect("enter", () => {
                                hideTimeout?.destroy()
                                hideTimeout = null
                            });
                            motion.connect("leave", () => {
                                hideTimeout = setTimeout(() => {
                                    setNotifications((ns) => ns.filter((it) => it.id !== notification.id))
                                    hideTimeout?.destroy()
                                    hideTimeout = null
                                }, TIMEOUT_DELAY)
                            });
                            self.add_controller(motion);
                        }}
                        notification={notification}
                        useHistoryCss={false}/>
                }}
            </For>
        </box>
    </window> as Astal.Window
}
