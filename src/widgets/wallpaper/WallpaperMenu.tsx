import BButton, { BButtonSize } from "../common/BButton";
import { getHyprMonitorsInfo } from "../utils/monitors";
import {Gtk} from "ags/gtk4";
import Hyprland from "gi://AstalHyprland"
import {createBinding, createState, For, createEffect} from "ags";
import type { Accessor, Setter } from "ags";
import { Variable } from "../../config/Variable";
import { closeIntegratedMonitorList } from "./IntegratedWallpaperMenu";
const { Box, CheckButton, Label, Window, Button } = Widget;
export const [monitors, monitorsSetter] = createState<string[]>([])
export const [selectedWallpaper, selectedWallpaperSetter] = createState<string>('')
// Function to get the list of monitor names

//On selectedWallpaper change, call getHyprMonitorsInfo
const wally = selectedWallpaper.subscribe(() => {
    console.log("Potential wallpaper:", selectedWallpaper.peek())
    saveWallpapersActive();
    getHyprMonitorsInfo().then((monitors) => {
        if (monitors === null) return
        const name = selectedWallpaper.peek()
        monitors.forEach((monitor) => {
            if (name == monitor.name) {
                console.log(`Output: ${monitor.name}, Monitor: ${monitor.id} uses ${name}`)
                wallpaperActives[monitor.id].set(true)
            }
        })
    })
})
wally();

export let wallpaperActives: Variable<boolean>[] = [
    new Variable(false),
    new Variable(false),
    new Variable(false),
    new Variable(false),
    new Variable(false)
];
const savedWallpapersActive: Variable<boolean>[] = wallpaperActives;

export function saveWallpapersActive() {
    wallpaperActives.forEach((value, index) => {
        savedWallpapersActive[index].set(value.peek());
      });
}

let selectedMonitors: string[] = [];

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
function updateWallpaper(monitor: Hyprland.Monitor, status: boolean) {
    if (!status) {
        //set monitor accessor to false
        wallpaperActives[monitor.id].set(false);
        //remove monitor name from cli command
        const index: number = selectedMonitors.indexOf(monitor.name);
        if (index !== -1) { // Ensure the item exists in the array
            selectedMonitors.splice(index, 1);
        }
    } else {
        wallpaperActives[monitor.name].set(true);
        selectedMonitors.push(monitor.name)
    }
}

// Custom multi-select monitor widget
function WallpaperSelectContent() {
    const hyprland = Hyprland.get_default()
    // const selectedMonitors = new Set();
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
                    //Clear selections and close entire widget menu
                    wallpaperActives = savedWallpapersActive;
                    closeIntegratedMonitorList();
                }}/>
            <BButton
                label=" Apply"
                backgroundCss={["wallpaperMenu-Apply"]}
                marginStart={4}
                onClicked={() => {
                    //Apply Settings
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
                        if (Number(monitor.id) > maxMonitors) {
                            console.warn(`Monitor selected (${monitor.id}) exceeds the maximum number of supported monitors for this feature`);
                            return
                        }
                        console.log(`Selected: ${monitor.name}`)
                        updateWallpaper(monitor,wallpaperActives[monitor.id].peek())
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