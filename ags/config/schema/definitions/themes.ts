import {Field} from "../primitiveDefinitions";

export const themesSchema = {
    name: 'themes',
    type: 'array',
    description: 'List of available panel themes.',
    default: [],
    item: {
        name: 'theme',
        type: 'object',
        required: true,
        children: [
            {
                name: 'name',
                type: 'string',
                required: true,
                description: 'Theme name.',
            },
            {
                name: 'icon',
                type: 'string',
                required: true,
                description: 'Icon (glyph) representing the theme in lists.',
            },
            {
                name: 'pixelOffset',
                type: 'number',
                default: 0,
                description: 'Icon offset (‑10 … 10).',
                withinConstraints: (value) => value >= -10 && value <= 10,
                constraintDescription: 'Must be between -10 and 10'
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
    },
} as const satisfies Field