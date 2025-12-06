import {execAsync} from "ags/process";

type HyprMonitorRaw = {
    id: number | string;
    name?: string;
    width?: number;
    height?: number;
    // ...other fields ignored
};

export type HyprMonitorInfo = {
    id: number;
    name: string;
    width: number;   // device pixels from hyprctl
    height: number;  // device pixels from hyprctl
    wallpaper?: string;
};

/**
 * Get Hyprland monitor info by numeric ID.
 * Returns { id, name, width, height } or null if not found/invalid.
 */
export async function getHyprMonitorInfoById(id: number | string): Promise<HyprMonitorInfo | null> {
    try {
        const out = await execAsync("hyprctl monitors -j");
        const data = JSON.parse(out) as unknown;

        if (!Array.isArray(data)) return null;

        const targetId = Number(id);
        const m = (data as HyprMonitorRaw[]).find(mon => Number(mon.id) === targetId);
        if (!m || typeof m.name !== "string") return null;

        // Guard DPMS/transient 0×0 reports; clamp to at least 1
        const w = Math.max(1, Number(m.width ?? 0));
        const h = Math.max(1, Number(m.height ?? 0));

        return { id: targetId, name: m.name, width: w, height: h };
    } catch (e) {
        console.error("getHyprMonitorInfoById error:", e);
        return null;
    }
}

export async function getHyprMonitorsInfo(): Promise<HyprMonitorInfo[] | null> {
    try {
        const out = await execAsync("hyprctl monitors -j");
        const data = JSON.parse(out) as unknown;

        const wallInfo = await execAsync("awww query");
        const wallInfoData = getMonitorbyWallpaper(wallInfo);

        if (!Array.isArray(data)) return null;

        const refinedData = data as HyprMonitorInfo[];
        refinedData.forEach((monitor) => {
            monitor.wallpaper = monitor.name in wallInfoData ? wallInfoData[monitor.name]:null;
        }
        )
        return refinedData
    } catch (e) {
        console.error("getHyprMonitorInfo error:", e);
        return null;
    }
}
function getMonitorbyWallpaper(path: string) {
    const boundaryRegex = /default: (.+?):.*?currently displaying: (.*?)(?=default:|$)/g;
  
    // 1. Define the helper function BEFORE it is used in the 'if' block.
    const mapMatches = (acc, match) => {
      const defaultName = match[1] ? match[1].trim() : '';
      const currentlyDisplaying = match[2] ? match[2].trim() : '';
      
      if (defaultName) {
          acc[defaultName] = currentlyDisplaying;
      }
      return acc;
    };
  
    const matches = [...path.matchAll(boundaryRegex)];
  
    // 2. Check for matches and execute fallback if needed
    if (matches.length === 0) {
        // Fallback logic
        const fallbackRegex = /default: (.+?):.*?currently displaying: (.+?)(?=default:|$)/g;
        const fallbackMatches = [...path.matchAll(fallbackRegex)];
        
        if (fallbackMatches.length > 0) {
            console.warn("Using fallback regex. Original regex failed to find matches.");
            // Now 'mapMatches' is defined and accessible here
            return fallbackMatches.reduce(mapMatches, {});
        }
        return {}; 
    }
  
    // 3. Process the successful matches
    // 'mapMatches' is also used here
    return matches.reduce(mapMatches, {});
    // Output:
    /*
    {
    'DP-1': '/home/user/images/wallpaper_4k.png',
    'HDMI-A-1': '#000000'
    }
    */
}