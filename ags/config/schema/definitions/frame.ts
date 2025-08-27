import {Field} from "../primitiveDefinitions";

export enum Position {
    LEFT = "left",
    RIGHT = "right",
}
export const POSITION_VALUES = Object.values(Position) as readonly Position[]

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
        {
            name: 'borderRadius',
            type: 'number',
            default: 8,
            description: 'Corner radius (px) for bars.',
            reactive: true,
        },
        {
            name: 'borderWidth',
            type: 'number',
            default: 2,
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
            default: {from: 'theme.colors.background'},
            description: 'Color of the bar background',
            reactive: true,
        },
        {
            name: 'menuPosition',
            type: 'enum',
            enumValues: POSITION_VALUES,
            default: Position.LEFT,
            description: 'What side of the frame the system menu is on.'
        },
        {
            name: 'notificationsPosition',
            type: 'enum',
            enumValues: POSITION_VALUES,
            default: Position.LEFT,
            description: 'What side of the frame the notification history is on.'
        },
        {
            name: 'calendarPosition',
            type: 'enum',
            enumValues: POSITION_VALUES,
            default: Position.LEFT,
            description: 'What side of the frame the calendar and weather is on.'
        },
        {
            name: 'clipboardManagerPosition',
            type: 'enum',
            enumValues: POSITION_VALUES,
            default: Position.LEFT,
            description: 'What side of the frame the clipboard manager is on.'
        },
    ],
} as const satisfies Field