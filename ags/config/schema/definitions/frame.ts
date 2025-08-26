import {Field} from "../primitiveDefinitions";

export const frameSchema = {
    name: 'frame',
    type: 'object',
    description: 'Configuration for the frame.',
    children: [
        {
            name: 'margin',
            type: 'number',
            default: 5,
            description: 'Margin (px) between the frame and other windows.'
        },
        {
            name: 'topThickness',
            type: 'number',
            default: 2,
            description: 'Thickness of the full screen frame.',
            reactive: true,
        },
        {
            name: 'bottomThickness',
            type: 'number',
            default: 2,
            description: 'Thickness of the full screen frame.',
            reactive: true,
        },
        {
            name: 'leftThickness',
            type: 'number',
            default: 2,
            description: 'Thickness of the full screen frame.',
            reactive: true,
        },
        {
            name: 'rightThickness',
            type: 'number',
            default: 2,
            description: 'Thickness of the full screen frame.',
            reactive: true,
        },
    ],
} as const satisfies Field