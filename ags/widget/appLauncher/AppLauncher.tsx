import Apps from "gi://AstalApps"
import App from "ags/gtk4/app"
import Pango from "gi://Pango?version=1.0";
import {hideAllWindows} from "../utils/windows";
import {Gdk, Gtk} from "ags/gtk4";
import Astal from "gi://Astal?version=4.0";
import {createComputed, createState, With, For, Accessor} from "ags";

export const AppLauncherWindowName = "appLauncher"

function launchApp(app: Apps.Application) {
    app.launch()
}

interface AppButtonProps {
    app: Apps.Application;
    isSelected: Accessor<boolean>;
}

function ensureChildVisible(scrolledWindow: Gtk.ScrolledWindow, index: number): void {
    const vAdj = scrolledWindow.get_vadjustment();
    const container = scrolledWindow.get_child();
    if (!container || !vAdj) return;

    // Magic number, height of each child
    const height = 48
    const viewStart = vAdj.get_value();
    const viewEnd = viewStart + vAdj.get_page_size();

    const childTop = (height) * index;
    const childBottom = (height * index) + height;

    if (childTop < viewStart) {
        vAdj.set_value(childTop);
    } else if (childBottom > viewEnd) {
        const newValue = childBottom - vAdj.get_page_size();
        vAdj.set_value(Math.min(newValue, vAdj.get_upper() - vAdj.get_page_size()));
    }
}

function AppButton({ app, isSelected }: AppButtonProps) {
    return <button
        canFocus={false}
        class={isSelected(s => s ? "selectedAppButton" : "appButton")}
        onClicked={() => {
            hideAllWindows()
            launchApp(app)
        }}>
        <box>
            <box
                valign={Gtk.Align.CENTER}
                orientation={Gtk.Orientation.VERTICAL}
            >
                <label
                    cssClasses={["name"]}
                    xalign={0}
                    label={app.name}
                    ellipsize={Pango.EllipsizeMode.END}
                />
            </box>
        </box>
    </button>
}

export default function () {
    const { CENTER } = Gtk.Align
    let apps = new Apps.Apps()

    const [selectedIndex, selectedIndexSetter] = createState(0)
    const [text, textSetter] = createState("")
    const list = text(text => {
        let listApps = apps
            .exact_query(text)
            .filter((app) => app.name.toLowerCase().includes(text.toLowerCase()))
            .sort((a, b) => {
                if (a.name === b.name) {
                    return 0
                }
                let aMatch = a.name.toLowerCase().startsWith(text.toLowerCase())
                let bMatch = b.name.toLowerCase().startsWith(text.toLowerCase())
                if (aMatch && bMatch) {
                    if (a.name > b.name) {
                        return 1
                    } else {
                        return -1
                    }
                } else if (aMatch) {
                    return -1
                } else {
                    return 1
                }
            })
        if (listApps.length - 1 < selectedIndex.get()) {
            if (listApps.length === 0) {
                selectedIndexSetter(0)
            } else {
                selectedIndexSetter(listApps.length - 1)
            }
        }
        return listApps
    })
    const onEnter = () => {
        if (list.get().length > 0) {
            const app = list.get()?.[selectedIndex.get()]
            if (app !== null) {
                launchApp(app)
            }
        }
        hideAllWindows()
    }
    const listBinding = createComputed([
        list,
        selectedIndex
    ])
    let textEntryBox: Gtk.Entry | null = null

    const scrolledWindow = (
        <Gtk.ScrolledWindow
            class="scrollWindow"
            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            propagateNaturalHeight={true}
            canFocus={false}
        >
            <box spacing={6} orientation={Gtk.Orientation.VERTICAL}>
                <For each={list}>
                    {(app, index) =>
                        <AppButton
                            app={app}
                            isSelected={selectedIndex(s => index.get() === s)}/>
                    }
                </For>
                <box
                    halign={CENTER}
                    orientation={Gtk.Orientation.VERTICAL}
                    marginBottom={8}
                    visible={list.as(l => l.length === 0)}>
                    <label
                        cssClasses={["labelSmall"]}
                        label="No match found"/>
                </box>
                <box/>
            </box>
        </Gtk.ScrolledWindow>
    ) as Gtk.ScrolledWindow

    return <window
        namespace={"okpanel-app-launcher"}
        name={AppLauncherWindowName}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        application={App}
        onShow={() => {
            apps = new Apps.Apps()
            textSetter("")
            selectedIndexSetter(0)
            if (textEntryBox != null) {
                textEntryBox.text = ""
            }
        }}
        cssClasses={["transparentBackground"]}
        marginTop={200}
        marginBottom={200}
        visible={false}
        $={(self) => {
            let keyController = new Gtk.EventControllerKey()

            keyController.connect("key-pressed", (_, key) => {
                if (key === Gdk.KEY_Escape) {
                    hideAllWindows()
                } else if (key === Gdk.KEY_Down && list.get().length >= selectedIndex.get()) {
                    selectedIndexSetter(selectedIndex.get() + 1)
                    ensureChildVisible(scrolledWindow, selectedIndex.get())
                } else if (key === Gdk.KEY_Up && selectedIndex.get() != 0) {
                    selectedIndexSetter(selectedIndex.get() - 1)
                    ensureChildVisible(scrolledWindow, selectedIndex.get())
                }
            })

            self.add_controller(keyController)
        }}>
        <box
            orientation={Gtk.Orientation.VERTICAL}>
            <box
                cssClasses={["window"]}>
                <box
                    widthRequest={500}
                    cssClasses={["appLauncher"]}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <box
                        orientation={Gtk.Orientation.HORIZONTAL}>
                        <label
                            cssClasses={["searchIcon"]}
                            label=""/>
                        <entry
                            cssClasses={["searchField"]}
                            placeholderText="Search"
                            onActivate={onEnter}
                            hexpand={true}
                            $={(self) => {
                                textEntryBox = self
                                self.connect('changed', () => textSetter(self.text))
                            }}
                        />
                    </box>
                    {scrolledWindow}
                </box>
            </box>
            <box
                vexpand={true}/>
        </box>
    </window>
}