import {Field} from "../primitiveDefinitions";

export const wallpaperSchema = {
    name: 'wallpaper',
    type: 'object',
    description: 'Wallpaper configs.',
    children: [
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
    ]
} as const satisfies Field