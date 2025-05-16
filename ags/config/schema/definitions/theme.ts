import {Field} from "../primitiveDefinitions";
import {BarWidget} from "./barWidgets";
import {windowsSchema} from "./windows";

export const themeSchema = {
    name: 'theme',
    type: 'object',
    description: 'Global theme definitions.',
    children: [
        {
            name: 'name',
            type: 'string',
            default: 'myTheme',
            description: 'Theme name.  Passed as the first argument to the themeUpdateScript when changing configs.',
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
        {
            name: 'colors',
            type: 'object',
            description: 'Palette used by widgets & windows.',
            children: [
                {
                    name: 'background',
                    type: 'color',
                    default: '#1F2932',
                    description: 'Background color'
                },
                {
                    name: 'foreground',
                    type: 'color',
                    default: '#AFB3BD',
                    description: 'Foreground color'
                },
                {
                    name: 'primary',
                    type: 'color',
                    default: '#7C545F',
                    description: 'Primary / accent color'
                },
                {
                    name: 'buttonPrimary',
                    type: 'color',
                    default: '#7C545F',
                    description: 'Button color'
                },
                {
                    name: 'warning',
                    type: 'color',
                    default: '#7C7C54',
                    description: 'Warning color'
                },
                {
                    name: 'alertBorder',
                    type: 'color',
                    default: '#7C545F',
                    description: 'Color of alert borders (OSD)'
                },
                {
                    name: 'scrimColor',
                    type: 'color',
                    default: '#00000001',
                    description: 'Color used for translucent overlays (RGBA hex).',
                    transformation: (value) => {
                        if (value === "#00000000" || value === "#000000") {
                            return "#00000001"
                        } else {
                            return value
                        }
                    }
                },
            ],
        },
        {
            name: 'bars',
            type: 'object',
            description: 'Theming configurations for the bars.',
            children: [
                {
                    name: 'borderRadius',
                    type: 'number',
                    default: 8,
                    description: 'Corner radius (px) for bars.',
                },
                {
                    name: 'borderWidth',
                    type: 'number',
                    default: 2,
                    description: 'Bar border width (px).',
                },
                {
                    name: 'borderColor',
                    type: 'color',
                    default: {from: 'theme.colors.primary'},
                    description: 'Color of the bar border'
                },
                {
                    name: 'backgroundColor',
                    type: 'color',
                    default: {from: 'theme.colors.background'},
                    description: 'Color of the bar background'
                },
                {
                    name: BarWidget.MENU,
                    type: "object",
                    description: "Theme configuration for the menu bar widget.",
                    children: [
                        {
                            name: 'icon',
                            type: 'icon',
                            default: '',
                            description: 'Icon shown on the menu button (ex: Nerd Font glyph).',
                        },
                        {
                            name: 'iconOffset',
                            type: 'number',
                            default: 1,
                            description: 'Offset of the menu button icon.  Use this if the icon is not centered properly'
                        },
                        {
                            name: 'foreground',
                            type: 'color',
                            default: {from: 'theme.colors.foreground'},
                            description: 'Foreground color of the widget.'
                        }
                    ],
                },
                {
                    name: BarWidget.WORKSPACES,
                    type: "object",
                    description: "Configuration for the workspaces bar widget.",
                    children: [
                        {
                            name: 'largeActive',
                            type: 'boolean',
                            default: false,
                            description: 'Make the active workspace icon larger'
                        },
                        {
                            name: 'activeIcon',
                            type: 'icon',
                            default: "",
                            description: 'Icon of the active workspace'
                        },
                        {
                            name: 'activeOffset',
                            type: 'number',
                            default: 1,
                            description: 'Offset of the active workspace icon.  Use this if the icon is not centered properly'
                        },
                        {
                            name: 'inactiveIcon',
                            type: 'icon',
                            default: "",
                            description: 'Icon of the inactive workspace'
                        },
                        {
                            name: 'inactiveOffset',
                            type: 'number',
                            default: 1,
                            description: 'Offset of the active workspace icon.  Use this if the icon is not centered properly'
                        },
                    ],
                },
            ],
        },
        windowsSchema,
    ],
} as const satisfies Field