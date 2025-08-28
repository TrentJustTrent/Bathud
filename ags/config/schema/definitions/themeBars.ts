import {Field} from "../primitiveDefinitions";

export const themeBarsSchema = {
    name: 'bars',
    type: 'object',
    description: 'Theming configurations for the bars.',
    children: [
        {
            name: 'borderRadius',
            type: 'number',
            default: 0,
            description: 'Corner radius (px) for bars.',
            reactive: true,
        },
        {
            name: 'borderWidth',
            type: 'number',
            default: 0,
            description: 'Bar border width (px).',
            reactive: true,
        },
        {
            name: 'borderColor',
            type: 'color',
            default: {from: 'theme.colors.primary'},
            description: 'Color of the bar border',
            reactive: true,
        },
        {
            name: 'backgroundColor',
            type: 'color',
            default: {from: 'frame.backgroundColor'},
            description: 'Color of the bar background',
            reactive: true,
        }
    ],
} as const satisfies Field