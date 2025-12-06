import BButton, { BButtonSize } from "../common/BButton";
import { getHyprMonitorsInfo } from "../utils/monitors";
import {Gtk} from "ags/gtk4";
import Hyprland from "gi://AstalHyprland"
import {createBinding, createState, For, createEffect} from "ags";
import type { Accessor, Setter } from "ags";
import { Variable } from "../../config/Variable";
import { closeIntegratedMonitorList } from "./IntegratedWallpaperMenu";
import { variableConfig } from "../../config/config";
const { Box, CheckButton, Label, Window, Button } = Widget;

export const [selectedWallpaper, selectedWallpaperSetter] = createState<string>('')

//On selectedWallpaper change, call getHyprMonitorsInfo
const wally = selectedWallpaper.subscribe(() => {
    const name = selectedWallpaper.peek()
    console.log("Potential wallpaper:", name)
    getHyprMonitorsInfo()
        .then((monitors) => {
            if (monitors === null) return
            monitors.forEach((monitor) => {
                if (name == monitor.wallpaper) {
                    console.log(`Output: ${monitor.name}, Monitor: ${monitor.id} uses ${name}`)
                    selectedMonitors[monitor.id].set(true)
                    outputBuffer.push(monitor.name)
                }
            })
        })
        .finally(()=> saveSelectedMonitors())
})
wally();

// Function to create an array of custom types with length n
function createList(n:number) {
    return Array.from({ length: n }, () => new Variable(false));
}
export const selectedMonitors: Variable<boolean>[] = createList(variableConfig.wallpaper.supportedMonitors.peek());

const savedWallpapersActive: Variable<boolean>[] = selectedMonitors;

export function saveSelectedMonitors() {
    selectedMonitors.forEach((value, index) => {
        savedWallpapersActive[index].set(value.peek());
      });
}

let outputBuffer: string[] = [];

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
    //Highlight selection in menu
    selectedMonitors[monitor.id].set(status);
    if (!status) {
        //set monitor accessor to false
        //wallpaperActives[monitor.id].set(false);

        //remove monitor name from cli command
        const index: number = outputBuffer.indexOf(monitor.name);
        if (index !== -1) { // Ensure the item exists in the array
            //Remove monitor name in place
            outputBuffer.splice(index, 1);
        }
    } else {
        //wallpaperActives[monitor.id].set(true);
        outputBuffer.push(monitor.name)
    }
}

// Custom multi-select monitor widget
function WallpaperSelectContent() {
    const hyprland = Hyprland.get_default()
    // const outputBuffer = new Set();
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
                        outputBuffer.add(name);
                    } else {
                        outputBuffer.delete(name);
                    }
                    console.log("Selected monitors:", Array.from(outputBuffer));
                },
            });
            // Set initial state if needed
            checkbox.active = outputBuffer.has(name); 
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
                    selectedMonitors = savedWallpapersActive;
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
                    selected={selectedMonitors[monitor.id].asAccessor()}
                    // selected={selectedMonitors[monitor.id]}
                    label={monitor.name}
                    onClicked={() => {
                        //Do something
                        //Should never trigger but just a gaurd
                        if (Number(monitor.id) > variableConfig.wallpaper.supportedMonitors.peek()) {
                            console.warn(`Monitor selected (${monitor.id}) exceeds the maximum number of supported monitors for this feature`);
                            return
                        }
                        updateWallpaper(monitor,!selectedMonitors[monitor.id].peek())
                        console.log(`Toggled: ${monitor.name}`)
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