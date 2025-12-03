import BButton, { BButtonSize } from "../common/BButton";
import { getHyprMonitorsInfo } from "../utils/monitors";
import {Gtk} from "ags/gtk4";
import Hyprland from "gi://AstalHyprland"
import {createBinding, createState, For} from "ags";
import { Variable } from "../../config/Variable";
const { Box, CheckButton, Label, Window, Button } = Widget;
export const [monitors, monitorsSetter] = createState<string[]>([])
export const [wallpapers, wallpapersSetter] = createState<string[]>([])
// Function to get the list of monitor names

export const wallpaper0 = new Variable(false);
export const wallpaper1 = new Variable(false);
export const wallpaper2 = new Variable(false);
export const wallpaper3 = new Variable(false);
export const wallpaper4 = new Variable(false);

export const wallpaperActives: Variable<boolean>[] = [
    new Variable(false),
    new Variable(false),
    new Variable(false),
    new Variable(false),
    new Variable(false)
] 



const getMonitors = async () => {
    try {
        const monitorsJson = await execAsync('hyprctl monitors -j');
        const monitors = JSON.parse(monitorsJson);
        return monitors.map(monitor => monitor.name);
    } catch (error) {
        console.error("Failed to get monitors:", error);
        return [];
    }
};

// Custom multi-select monitor widget
function WallpaperSelectContent() {
    const hyprland = Hyprland.get_default()
    const selectedMonitors = new Set();
    const monitorList = Box({
        vertical: true,
        children: [],
    });

    // Function to update the monitor list in the UI
    const updateMonitorList = async () => {
        const availableMonitors = await getHyprMonitorsInfo();
        monitorList.children = availableMonitors.map(name => {
            const checkbox = CheckButton({
                hpack: 'start',
                child: Label({ label: name }),
                on_toggled: ({ active }) => {
                    if (active) {
                        selectedMonitors.add(name);
                    } else {
                        selectedMonitors.delete(name);
                    }
                    console.log("Selected monitors:", Array.from(selectedMonitors));
                },
            });
            // Set initial state if needed
            checkbox.active = selectedMonitors.has(name); 
            return checkbox;
        });
        return 
    };

    // Initial update and subscribe to monitor changes (Hyprland service might provide signals)
    updateMonitorList();
    // In a real AGS setup, you'd want to listen for Hyprland's 'monitors-changed' signal or similar
    // to automatically update the list if a monitor is connected/disconnected.

    return <box
        cssClasses={["barTimerBackground"]} vertical= {true} spacing={2}>
        <box
            orientation={Gtk.Orientation.HORIZONTAL}>
            <label
                marginStart={4}
                cssClasses={["labelMediumBold"]}
                label="Select Monitors:"/>
            <box hexpand={true}/>
            <BButton
                label=" Close"
                labelCss={["wallpaperMenu-Clear"]}
                onClicked={() => {
                    //Apply Settings
                }}/>
            <BButton
                label=" Apply"
                backgroundCss={["wallpaperMenu-Apply"]}
                marginStart={4}
                onClicked={() => {
                    //Clear selections and close entire widget menu
                }}/>
        </box>
        <For each={createBinding(hyprland, "monitors")}>
            {(monitor: Hyprland.Monitor) => {
                return <BButton
                    size={BButtonSize.MEDIUM}
                    bold={true}
                    hexpand={true}
                    primary={true}
                    labelHalign={Gtk.Align.START}
                    selected={wallpaperActives[monitor.id].asAccessor()}
                    label={monitor.name}
                    onClicked={() => {
                        //Do something
                    }}/>
            }}
        </For>
        </box>;
};
export default function () {
    return <box
        cssClasses={["clipboardBox"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <label
            marginBottom={16}
            cssClasses={["labelMedium"]}
            label="Wallpaper Menu"/>
        <WallpaperSelectContent/>
    </box>
}