import {Field} from "../primitiveDefinitions";
import {soundsSchema} from "./sounds";
import {windowsSchema} from "./windows";
import {notificationsSchema} from "./notifications";
import {horizontalBarSchema, verticalBarSchema} from "./bars";
import {systemMenuSchema} from "./systemMenu";
import {systemCommandsSchema} from "./systemCommands";
import {themeSchema} from "./theme";

export const CONFIG_SCHEMA = [
    {
        name: 'icon',
        type: 'string',
        default: '',
        description: 'Icon (glyph) representing this config file.',
    },
    {
        name: 'iconOffset',
        type: 'number',
        default: 0,
        description: 'Icon offset (‑10 … 10).',
        withinConstraints: (value) => value >= -10 && value <= 10,
        constraintDescription: 'Must be between -10 and 10'
    },
    {
        name: 'buttonBorderRadius',
        type: 'number',
        default: 8,
        description: 'Border radius (px) used by regular buttons.',
    },
    {
        name: 'largeButtonBorderRadius',
        type: 'number',
        default: 16,
        description: 'Border radius (px) used by large buttons.',
    },
    {
        name: 'themeUpdateScript',
        type: 'string',
        description: 'Absolute path to the script run when a theme changes.',
        required: false,
    },
    {
        name: 'wallpaperUpdateScript',
        type: 'string',
        description: 'Absolute path to the script run when the wallpaper changes.',
        required: false,
    },
    {
        name: 'mainMonitor',
        type: 'number',
        default: 0,
        description: 'Index of the primary monitor (0‑based as reported by Hyprland).',
    },
    {
        name: 'scrimColor',
        type: 'color',
        default: '#00000001',
        description: 'CSS/GTK‑style color used for translucent overlays (RGBA hex). If set to #00000000 scrim will be disabled.',
        transformation: (value) => {
            if (value === "#00000000" || value === "#000000") {
                return "#00000001"
            } else {
                return value
            }
        }
    },
    {
        name: 'font',
        type: 'string',
        default: 'JetBrainsMono NF',
        description: 'Default font family used across the panel widgets.',
    },
    {
        name: 'nightLightTemperature',
        type: 'number',
        default: 5000,
        description: 'The temperature of the night light.'
    },
    soundsSchema,
    windowsSchema,
    notificationsSchema,
    systemCommandsSchema,
    themeSchema,
    systemMenuSchema,
    horizontalBarSchema,
    verticalBarSchema,
] as const satisfies Field[]