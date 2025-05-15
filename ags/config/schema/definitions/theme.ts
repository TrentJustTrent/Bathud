import {Field} from "../primitiveDefinitions";

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
                    name: 'barBorder',
                    type: 'color',
                    default: '#7C545F',
                    description: 'Color of the bar border'
                },
                {
                    name: 'windowBorder',
                    type: 'color',
                    default: '#AFB3BD',
                    description: 'Color of window borders'
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
                    description: 'CSS/GTK‑style color used for translucent overlays (RGBA hex).',
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
    ],
} as const satisfies Field