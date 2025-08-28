import {Field} from "../primitiveDefinitions";

export enum Position {
    LEFT = "left",
    RIGHT = "right",
}
export const POSITION_VALUES = Object.values(Position) as readonly Position[]

const commonFrameGroupSchema = [
    {
        name: 'marginStart',
        type: 'number',
        default: 0,
        description: 'Starting margin of the bar',
        reactive: true,
    },
    {
        name: 'marginEnd',
        type: 'number',
        default: 0,
        description: 'Ending margin of the bar',
        reactive: true,
    },
    {
        name: 'marginTop',
        type: 'number',
        default: 0,
        description: 'Top margin of the bar',
        reactive: true,
    },
    {
        name: 'marginBottom',
        type: 'number',
        default: 0,
        description: 'Bottom margin of the bar',
        reactive: true,
    },
    {
        name: 'borderRadius',
        type: 'number',
        default: 0,
        description: 'Corner radius (px) for the frame group.',
        reactive: true,
    },
    {
        name: 'borderWidth',
        type: 'number',
        default: 0,
        description: 'Border width (px) for the frame group.',
        reactive: true,
    },
    {
        name: 'borderColor',
        type: 'color',
        default: {from: 'theme.colors.primary'},
        description: 'Color of the frame group border',
        reactive: true,
    },
] as const satisfies Field[]

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
        {
            name: 'leftGroup',
            type: 'object',
            description: 'Configurations for the left group.  Includes the left bar and all menus with a left position',
            children: [...commonFrameGroupSchema]
        },
        {
            name: 'rightGroup',
            type: 'object',
            description: 'Configurations for the right group.  Includes the right bar and all menus with a right position',
            children: [...commonFrameGroupSchema]
        }
    ],
} as const satisfies Field