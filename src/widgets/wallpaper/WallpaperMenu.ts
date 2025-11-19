import { getHyprMonitorsInfo } from "../utils/monitors";

// Function to get the list of monitor names
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
export const MonitorMultiSelect = () => {
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
    };

    // Initial update and subscribe to monitor changes (Hyprland service might provide signals)
    updateMonitorList();
    // In a real AGS setup, you'd want to listen for Hyprland's 'monitors-changed' signal or similar
    // to automatically update the list if a monitor is connected/disconnected.

    return Box({
        vertical: true,
        children: [
            Label({ label: "Select Monitors" }),
            monitorList,
            Button({
                label: "Apply Selection (Example Action)",
                on_clicked: () => {
                    // Example action: print the selected monitors and then apply some hyprctl command
                    const selectedArray = Array.from(selectedMonitors);
                    if (selectedArray.length > 0) {
                        console.log("Applying settings for:", selectedArray.join(', '));
                        // --outputs selectedArray.join(',');
                        // Example: You could loop through and apply 'monitor' keywords using execAsync
                        // execAsync(`hyprctl keyword monitor ${selectedArray[0]},...`)
                    } else {
                        console.log("No monitors selected.");
                    }
                },
            }),
        ],
    });
};