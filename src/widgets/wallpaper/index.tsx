import GObject, { GLib, property, register, signal } from 'astal/gobject';
import { AwwwDaemon } from './awwwDaemon';
import { execAsync} from 'astal';
import { variableConfig } from '../../config/config';
import { projectDir } from '../../app'
import { updateFiles } from '../systemMenu/widgets/LookAndFeelControls';

/**
 * Service for managing desktop wallpaper using awww daemon
 */
@register({ GTypeName: 'Wallpaper' })
export class WallpaperService extends GObject.Object {
    // @property(String)
    // declare public wallpaper: string;

    @signal(Boolean)
    declare public changed: (event: boolean) => void;

    private static _instance: WallpaperService;
    private _daemon = new AwwwDaemon();

    constructor() {
        super();

        if (variableConfig.wallpaper.showWallpaper.peek()) {
            this._daemon.start().then((started) => {
                if (started) {
                    console.log('Started Awww daemon from wallpaper service');
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
        //Make sure this isn't a gif preview
        const suffix = "_ff.jpg";
        if (path.endsWith(suffix)) {
            console.log(`Getting gif version of ${path}`)
            const gif = path.replace(suffix, ".gif");
            this._daemon.setWallpaper(gif, outputs)
        } else {
            this._daemon.setWallpaper(path, outputs)
        }
        updateFiles()
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
    let path = variableConfig.wallpaper.wallpaperDir.peek() !== ""
        ? variableConfig.wallpaper.wallpaperDir.peek()
        : `${homePath}/.wallpapers`;
    
    execAsync(`bash -c "${projectDir}/shellScripts/generatePreviews ${path}"`)
        .catch((error) => {
            console.error(error)
        })
}