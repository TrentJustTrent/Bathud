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
            description: 'Theme name.',
        },
        {
            name: 'wallpaperDir',
            type: 'string',
            default: '',
            description: 'Directory containing theme wallpapers (may be empty).',
        },
        {
            name: 'colors',
            type: 'object',
            description: 'Palette used by widgets & windows.',
            children: [
                {name: 'background', type: 'color', default: '#1F2932'},
                {name: 'foreground', type: 'color', default: '#AFB3BD'},
                {name: 'primary', type: 'color', default: '#7C545F'},
                {name: 'buttonPrimary', type: 'color', default: '#7C545F'},
                {name: 'warning', type: 'color', default: '#7C7C54'},
                {name: 'barBorder', type: 'color', default: '#7C7C54'},
                {name: 'windowBorder', type: 'color', default: '#AFB3BD'},
                {name: 'alertBorder', type: 'color', default: '#7C545F'},
            ],
        },
    ],
} as const satisfies Field