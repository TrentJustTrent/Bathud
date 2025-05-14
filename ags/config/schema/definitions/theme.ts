import {Field} from "../primitiveDefinitions";

export const themeSchema = {
    name: 'theme',
    type: 'object',
    description: 'Global theme definitions.',
    children: [
        {
            name: 'name',
            type: 'string',
            required: true,
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
            required: true,
            description: 'Palette used by widgets & windows.',
            children: [
                {name: 'background', type: 'color', required: true},
                {name: 'foreground', type: 'color', required: true},
                {name: 'primary', type: 'color', required: true},
                {name: 'buttonPrimary', type: 'color', required: true},
                {name: 'warning', type: 'color', required: true},
                {name: 'barBorder', type: 'color', required: true},
                {name: 'windowBorder', type: 'color', required: true},
                {name: 'alertBorder', type: 'color', required: true},
            ],
        },
    ],
} as const satisfies Field