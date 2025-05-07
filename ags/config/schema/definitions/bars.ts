import {Field} from "../primitiveDefinitions";
import {BAR_WIDGET_VALUES, BarWidget, barWidgetsSchema} from "./barWidgets";

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
        name: 'expanded',
        type: 'boolean',
        default: true,
        description: 'If true, the bar stretches to the full monitor width.',
    },
    {
        name: 'splitSections',
        type: 'boolean',
        default: false,
        description: 'If true, left/center/right widgets are rendered separately with padding.',
    },
    {
        name: 'sectionPadding',
        type: 'number',
        default: 0,
        description: 'Padding (px) around each section when splitSections = true.',
    },
    {
        name: 'widgetSpacing',
        type: 'number',
        default: 0,
        description: 'Spacing (px) between widgets inside the bar.',
    },
    {
        name: 'fullBarCavaWaveform',
        type: 'object',
        description: 'Full bar cava waveform configurations.',
        children: [
            {
                name: 'enabled',
                type: 'boolean',
                default: false,
                description: 'Shows a cava waveform stretching across the entire bar, underneath other widgets.  Does not show when split sections are enabled.'
            },
            {
                name: 'intensityMultiplier',
                type: 'number',
                default: 1,
                description: 'Makes the waves bigger or smaller.'
            },
        ]
    },
] as const satisfies Field[]

export const horizontalBarSchema = {
    name: 'horizontalBar',
    type: 'object',
    description: 'Configuration for a horizontal (top/bottom) bar layout.',
    children: [
        barWidgetsArrayField(
            'leftWidgets',
            'Widgets anchored left.',
            [
                BarWidget.MENU,
                BarWidget.WORKSPACES
            ]
        ),
        barWidgetsArrayField(
            'centerWidgets',
            'Widgets centered horizontally.',
            [
                BarWidget.CAVA_WAVEFORM,
                BarWidget.MPRIS_CONTROLS,
                BarWidget.MPRIS_TRACK_INFO,
            ]
        ),
        barWidgetsArrayField(
            'rightWidgets',
            'Widgets anchored right.',
            [
                BarWidget.RECORDING_INDICATOR,
                BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER,
                BarWidget.TRAY,
                BarWidget.CLIPBOARD_MANAGER,
                BarWidget.POWER_PROFILE,
                BarWidget.AUDIO_OUT,
                BarWidget.AUDIO_IN,
                BarWidget.BLUETOOTH,
                BarWidget.VPN_INDICATOR,
                BarWidget.NETWORK,
                BarWidget.BATTERY,
                BarWidget.CLOCK
            ],
        ),
        {
            name: 'minimumWidth',
            type: 'number',
            default: 800,
            description: 'Minimum bar width if not expanded.',
            withinConstraints: (value) => value >= 500,
            constraintDescription: 'Must be >= 500',
        },
        ...commonBarChildrenSchema,
        ...barWidgetsSchema(false),
    ],
} as const satisfies Field

export const verticalBarSchema = {
    name: 'verticalBar',
    type: 'object',
    description: 'Configuration for a vertical (left/right) bar layout.',
    children: [
        barWidgetsArrayField(
            'topWidgets',
            'Widgets anchored at the top.',
            [
                BarWidget.MENU,
                BarWidget.WORKSPACES
            ]
        ),
        barWidgetsArrayField(
            'centerWidgets',
            'Widgets centered vertically.',
            [
                BarWidget.MPRIS_TRACK_INFO,
                BarWidget.MPRIS_CONTROLS,
                BarWidget.CAVA_WAVEFORM,
            ]
        ),
        barWidgetsArrayField(
            'bottomWidgets',
            'Widgets anchored at the bottom.',
            [
                BarWidget.RECORDING_INDICATOR,
                BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER,
                BarWidget.TRAY,
                BarWidget.CLIPBOARD_MANAGER,
                BarWidget.POWER_PROFILE,
                BarWidget.AUDIO_OUT,
                BarWidget.AUDIO_IN,
                BarWidget.BLUETOOTH,
                BarWidget.VPN_INDICATOR,
                BarWidget.NETWORK,
                BarWidget.BATTERY,
                BarWidget.CLOCK,
            ],
        ),
        {
            name: 'minimumHeight',
            type: 'number',
            default: 600,
            description: 'Minimum bar height if not expanded.',
            withinConstraints: (value) => value >= 500,
            constraintDescription: 'Must be >= 500',
        },
        ...commonBarChildrenSchema,
        ...barWidgetsSchema(true),
    ],
} as const satisfies Field
