import BButton, { BButtonSize } from "../common/BButton";
import { getHyprMonitorsInfo } from "../utils/monitors";
import {Gtk} from "ags/gtk4";
import Hyprland from "gi://AstalHyprland"
import {createBinding, createState, For, onCleanup} from "ags";
import { Variable } from "../../config/Variable";
import { closeIntegratedMonitorList } from "./IntegratedWallpaperMenu";
import { variableConfig } from "../../config/config";
import { changingWallpaperBusy, wallpaperService } from "../systemMenu/widgets/LookAndFeelControls";

export const [selectedWallpaper, selectedWallpaperSetter] = createState<string>('')
const [resetButton, setResetButton] = createState(" Close")
let initialStatus = true;//Created because comparing strings with glyphs can be finicky

function manipulateMenuState(action: string, monitor: Hyprland.Monitor = null, status: boolean = false) {
    switch (action) {
        case 'update':
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
            break;
        case 'reset':
            selectedMonitors.forEach((item, index) => {
                item.set(initialMenuState[index].peek())
            })
            break;
        case 'clear':
            selectedMonitors.forEach((item) => {
                item.set(false)
            })
            break;
        default:
            console.error('Wrong command sent to manipulateMenuState function');
            break;
    }
    return;
}
// Function to create an array of custom types with length n
function createList(n:number) {
    return Array.from({ length: n }, () => new Variable(false));
}
const selectedMonitors: Variable<boolean>[] = createList(variableConfig.wallpaper.supportedMonitors.peek());

const initialMenuState: Variable<boolean>[] = selectedMonitors;

export function saveSelectedMonitors() {
    selectedMonitors.forEach((value, index) => {
        initialMenuState[index].set(value.peek());
      });
}

let outputBuffer: string[] = [];

// Custom multi-select monitor widget
function WallpaperSelectContent() {
    const hyprland = Hyprland.get_default()//On selectedWallpaper change, call getHyprMonitorsInfo
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
    onCleanup(wally)

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
                label={resetButton}
                labelCss={["wallpaperMenu-Clear"]}
                onClicked={() => {
                    //Clear selections and close entire widget menu
                    if (initialStatus) {
                        manipulateMenuState('clear')
                        changingWallpaperBusy = false
                        closeIntegratedMonitorList();
                    } else {
                        setResetButton(' Close')
                        initialStatus = true
                        manipulateMenuState('reset')
                    }
                }}/>
            <BButton
                label=" Apply"
                backgroundCss={["wallpaperMenu-Apply"]}
                marginStart={4}
                onClicked={() => {
                    //Apply Settings
                    changingWallpaperBusy = false
                    wallpaperService.setWallpaper(selectedWallpaper.peek(),outputBuffer)
                    closeIntegratedMonitorList();
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
                        if (initialStatus) { 
                            initialStatus = false
                            setResetButton('  Clear')
                        }
                        // updateWallpaper(monitor,!selectedMonitors[monitor.id].peek())
                        manipulateMenuState('update',monitor,!selectedMonitors[monitor.id].peek())
                        console.log(`Selection of ${monitor.name}:`,!selectedMonitors[monitor.id].peek())
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