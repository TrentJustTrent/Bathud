import {Field} from "../primitiveDefinitions";
import {BAR_WIDGET_VALUES, BarWidget} from "./barWidgets";

export const barWidgetsArrayField = <N extends string>( //preserve the literal key
    name: N,
    description: string,
    defaults: readonly BarWidget[],
) =>
    ({
        name,
        type: "array",
        description,
        default: defaults,
        item: {
            name: "widget",
            type: "enum",
            enumValues: BAR_WIDGET_VALUES,
        },
    } as const satisfies Field & { name: N })

const commonBarChildrenSchema = [
    {
        name: 'compact',
        type: 'boolean',
        default: false,
        description: 'Enabled compact bar mode.',
    },
    {
        name: 'widgetSpacing',
        type: 'number',
        default: 0,
        description: 'Spacing (px) between widgets inside the bar.',
    },
] as const satisfies Field[]

export const topBarSchema = {
    name: 'topBar',
    type: 'object',
    description: 'Configuration for the top bar layout.',
    children: [
        barWidgetsArrayField(
            'leftWidgets',
            'Widgets anchored left.',
            []
        ),
        barWidgetsArrayField(
            'centerWidgets',
            'Widgets centered horizontally.',
            []
        ),
        barWidgetsArrayField(
            'rightWidgets',
            'Widgets anchored right.',
            [],
        ),
        ...commonBarChildrenSchema,
    ],
} as const satisfies Field

export const bottomBarSchema = {
    name: 'bottomBar',
    type: 'object',
    description: 'Configuration for the bottom bar layout.',
    children: [
        barWidgetsArrayField(
            'leftWidgets',
            'Widgets anchored left.',
            []
        ),
        barWidgetsArrayField(
            'centerWidgets',
            'Widgets centered horizontally.',
            []
        ),
        barWidgetsArrayField(
            'rightWidgets',
            'Widgets anchored right.',
            [],
        ),
        ...commonBarChildrenSchema,
    ],
} as const satisfies Field

export const leftBarSchema = {
    name: 'leftBar',
    type: 'object',
    description: 'Configuration for the left bar layout.',
    children: [
        barWidgetsArrayField(
            'topWidgets',
            'Widgets anchored at the top.',
            []
        ),
        barWidgetsArrayField(
            'centerWidgets',
            'Widgets centered vertically.',
            []
        ),
        barWidgetsArrayField(
            'bottomWidgets',
            'Widgets anchored at the bottom.',
            [],
        ),
        ...commonBarChildrenSchema,
    ],
} as const satisfies Field

export const rightBarSchema = {
    name: 'rightBar',
    type: 'object',
    description: 'Configuration for the right bar layout.',
    children: [
        barWidgetsArrayField(
            'topWidgets',
            'Widgets anchored at the top.',
            []
        ),
        barWidgetsArrayField(
            'centerWidgets',
            'Widgets centered vertically.',
            []
        ),
        barWidgetsArrayField(
            'bottomWidgets',
            'Widgets anchored at the bottom.',
            [],
        ),
        ...commonBarChildrenSchema,
    ],
} as const satisfies Field
