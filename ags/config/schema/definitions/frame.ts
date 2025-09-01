import {Field} from "../primitiveDefinitions";

export enum Position {
    LEFT = "left",
    RIGHT = "right",
}
export const POSITION_VALUES = Object.values(Position) as readonly Position[]

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
            name: 'drawFrame',
            type: 'boolean',
            default: true,
            description: 'Whether to draw the frame or not.'
        },
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
    ],
} as const satisfies Field