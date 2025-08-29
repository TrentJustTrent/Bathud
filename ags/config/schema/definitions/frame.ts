import {Field} from "../primitiveDefinitions";

export enum Position {
    LEFT = "left",
    RIGHT = "right",
}
export const POSITION_VALUES = Object.values(Position) as readonly Position[]

const commonFrameGroupSchema = [
    {
        name: 'expanded',
        type: 'boolean',
        default: true,
        description: 'If true, the group expands to full height',
        reactive: true,
    },
    {
        name: 'minimumHeight',
        type: 'number',
        default: 800,
        description: 'The minimum height of the group if not expanded.',
        reactive: true,
    },
    {
        name: 'marginStart',
        type: 'number',
        default: 0,
        description: 'Starting margin of the group.',
        reactive: true,
    },
    {
        name: 'marginEnd',
        type: 'number',
        default: 0,
        description: 'Ending margin of the group.',
        reactive: true,
    },
    {
        name: 'marginTop',
        type: 'number',
        default: 0,
        description: 'Top margin of the group.',
        reactive: true,
    },
    {
        name: 'marginBottom',
        type: 'number',
        default: 0,
        description: 'Bottom margin of the group.',
        reactive: true,
    },
    {
        name: 'paddingStart',
        type: 'number',
        default: 0,
        description: 'Starting padding of the group.',
        reactive: true,
    },
    {
        name: 'paddingEnd',
        type: 'number',
        default: 0,
        description: 'Ending padding of the group.',
        reactive: true,
    },
    {
        name: 'paddingTop',
        type: 'number',
        default: 0,
        description: 'Top padding of the group.',
        reactive: true,
    },
    {
        name: 'paddingBottom',
        type: 'number',
        default: 0,
        description: 'Bottom padding of the group.',
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
    {
        name: 'backgroundColor',
        type: 'color',
        default: {from: 'frame.backgroundColor'},
        description: 'Color of the bar background',
        reactive: true,
    },
] as const satisfies Field[]

function commonIntegrationSchema(
    pushContent: boolean = false
) {
    return [
        {
            name: 'position',
            type: 'enum',
            enumValues: POSITION_VALUES,
            default: Position.LEFT,
            description: 'What side of the frame the integration is on.'
        },
        {
            name: 'pushContent',
            type: 'boolean',
            default: pushContent,
            description: 'If the integration should push normal windows / content when expanded.'
        }
    ] as const satisfies Field[]
}

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
            name: 'menu',
            type: 'object',
            description: 'Configurations for the expandable menu integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'notifications',
            type: 'object',
            description: 'Configurations for the expandable notifications integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'calendar',
            type: 'object',
            description: 'Configurations for the expandable calendar integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'clipboardManager',
            type: 'object',
            description: 'Configurations for the expandable clipboard manager integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'screenshotTool',
            type: 'object',
            description: 'Configurations for the expandable screenshot tool integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'appLauncher',
            type: 'object',
            description: 'Configurations for the expandable appLauncher integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'screenshare',
            type: 'object',
            description: 'Configurations for the screen share menu integration.',
            children: [...commonIntegrationSchema()],
        },
        {
            name: 'leftGroup',
            type: 'object',
            description: 'Configurations for the left group.  Includes the left bar and all menus with a left position.',
            children: [...commonFrameGroupSchema]
        },
        {
            name: 'rightGroup',
            type: 'object',
            description: 'Configurations for the right group.  Includes the right bar and all menus with a right position.',
            children: [...commonFrameGroupSchema]
        }
    ],
} as const satisfies Field