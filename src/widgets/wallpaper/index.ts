import GObject, { GLib, property, register, signal } from 'astal/gobject';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';
import { AwwwDaemon } from './awwwDaemon';
import { execAsync} from 'astal';
import { variableConfig } from '../../config/config';
import { projectDir } from '../../app';

const hyprlandService = AstalHyprland.get_default();
const WP = `${GLib.get_home_dir()}/.config/background`;

/**
 * Service for managing desktop wallpaper using awww daemon
 */
@register({ GTypeName: 'Wallpaper' })
export class WallpaperService extends GObject.Object {
    @property(String)
    declare public wallpaper: string;

    @signal(Boolean)
    declare public changed: (event: boolean) => void;

    private static _instance: WallpaperService;
    private _blockMonitor = false;
    private _daemon = new AwwwDaemon();

    constructor() {
        super();

        if (variableConfig.wallpaper.showWallpaper.get()) {
            this._daemon.start().then((started) => {
                if (started) {
                    this._wallpaper();
                }
            });
        } else {
            this._daemon.stop();
        }
    }

    /**
     * Gets the singleton instance of WallpaperService
     *
     * @returns The WallpaperService instance
     */
    public static getInstance(): WallpaperService {
        if (this._instance === undefined) {
            this._instance = new WallpaperService();
        }

        return this._instance;
    }

    /**
     * Sets a new wallpaper from the specified file path
     *
     * @param path - Path to the wallpaper image file
     */
    public setWallpaper(path: string,outputs: string[] = []): void {
        this._daemon.setWallpaper(path, outputs)
    }

    /**
     * Checks if the wallpaper service is currently running
     *
     * @returns Whether awww daemon is active
     */
    public isRunning(): boolean {
        return this._daemon.isRunning;
    }
}
export function generatePreviews() {
    const homePath = GLib.get_home_dir();
    let path = variableConfig.wallpaper.wallpaperDir.get() !== ""
        ? variableConfig.wallpaper.wallpaperDir.get()
        : `${homePath}/.wallpapers`;
    
    execAsync(`bash -c "${projectDir}/shellScripts/generatePreviews ${path}"`)
        .catch((error) => {
            console.error(error)
        })
}