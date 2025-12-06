import {Field} from "../primitiveDefinitions";

export enum WallpaperTransitionType {
    None = "none",
    Crossfade = "crossfade",
    Simple = "simple",
    Fade = "fade",
    Left = "left",
    Right = "right",
    Top = "top",
    Bottom = "bottom",
    Wipe = "wipe",//Uses transition angle
    Wave = "wave",//Uses transition angle
    Grow = "grow",//Uses transition pos
    Center = "center",
    Any = "any",
    Outer = "outer",//Uses transition pos
    Random = "random",
    
}

export const WALLPAPER_TRANSITION_VALUES = Object.values(WallpaperTransitionType) as readonly WallpaperTransitionType[]

export const wallpaperSchema = {
    name: 'wallpaper',
    type: 'object',
    description: 'Wallpaper configs.',
    children: [
        {
            name: 'supportedMonitors',
            type: 'number',
            default: 5,
            description: 'The max number of supported monitors. Ensures stability of wallpaper menu.'
        },
        {
            name: 'showWallpaper',
            type: 'boolean',
            default: 'true',
            description: 'Show the wallpaper in Bathud.  Set to false if you want to use another wallpaper program',
        },
        {
            name: 'wallpaperUpdateScript',
            type: 'string',
            description: 'Absolute path to the script run when the wallpaper changes.  Wallpaper path is sent as an argument to the script.',
            required: false,
        },
        {
            name: 'wallpaperDir',
            type: 'string',
            default: '',
            description: 'Directory containing theme wallpapers (may be empty).',
        },
        {
            name: 'transitionType',
            type: 'enum',
            enumValues: WALLPAPER_TRANSITION_VALUES,
            default: WallpaperTransitionType.Random,
            description: 'The type of transition animation when switching wallpapers.'
        },
        {
            name: 'transitionDuration',
            type: 'number',
            default: 3,
            description: 'The duration of the transition animation when switching wallpapers in seconds.'
        },
        {
            name: 'transitionFPS',
            type: 'number',
            default: 60,
            description: 'The Frames per Second of the transition animation when switching wallpapers.'
        },
    ]
} as const satisfies Field