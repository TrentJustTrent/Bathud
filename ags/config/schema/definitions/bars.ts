import {Field} from "../primitiveDefinitions";

export enum BarWidget {
    MENU = "menu",
    WORKSPACES = "workspaces",
    CLOCK = "clock",
    AUDIO_OUT = "audio_out",
    AUDIO_IN = "audio_in",
    BLUETOOTH = "bluetooth",
    NETWORK = "network",
    RECORDING_INDICATOR = "recording_indicator",
    VPN_INDICATOR = "vpn_indicator",
    BATTERY = "battery",
    TRAY = "tray",
    INTEGRATED_TRAY = "integrated_tray",
    APP_LAUNCHER = "app_launcher",
    SCREENSHOT = "screenshot",
    CLIPBOARD_MANAGER = "clipboard_manager",
    POWER_PROFILE = "power_profile",
    CAVA_WAVEFORM = "cava_waveform",
    MPRIS_CONTROLS = "mpris_controls",
    MPRIS_TRACK_INFO = "mpris_track_info",
    MPRIS_PRIMARY_PLAYER_SWITCHER = "mpris_primary_player_switcher",
    NOTIFICATION_HISTORY = "notification_history"
}
export const BAR_WIDGET_VALUES = Object.values(BarWidget) as readonly BarWidget[]

export enum VerticalWaveformPosition {
    INNER = "inner",
    OUTER = "outer",
    LEFT = "left",
    RIGHT = "right",
}
export const VERTICAL_WAVEFORM_POSITIONS = Object.values(VerticalWaveformPosition) as readonly VerticalWaveformPosition[]

export enum HorizontalWaveformPosition {
    INNER = "inner",
    OUTER = "outer",
    TOP = "top",
    BOTTOM = "bottom",
}

export const HORIZONTAL_WAVEFORM_POSITIONS = Object.values(HorizontalWaveformPosition) as readonly HorizontalWaveformPosition[]

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
                BarWidget.MPRIS_TRACK_INFO,
                BarWidget.MPRIS_CONTROLS,
                BarWidget.CAVA_WAVEFORM
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
            name: 'minimumWidth',
            type: 'number',
            default: 800,
            description: 'Minimum bar width if not expanded.',
            withinConstraints: (value) => value >= 500,
            constraintDescription: 'Must be > 500',
        },
        {
            name: 'widgetSpacing',
            type: 'number',
            default: 0,
            description: 'Spacing (px) between widgets inside the bar.',
        },
        {
            name: 'cavaWaveformLength',
            type: 'number',
            default: 200,
            description: 'Length of the cava waveform.  This has no effect on the full bar waveform.'
        },
        {
            name: 'cavaWaveformExpanded',
            type: 'boolean',
            default: false,
            description: 'Expands the waveform to fill the empty space.  This can expand beyond the set length.  This has no effect on the full bar waveform.'
        },
        {
            name: 'cavaWaveformPosition',
            type: 'enum',
            enumValues: HORIZONTAL_WAVEFORM_POSITIONS,
            default: HorizontalWaveformPosition.BOTTOM,
            description: 'The base position of the waveform'
        },
        {
            name: 'cavaWaveformIntensityMultiplier',
            type: 'number',
            default: 1,
            description: 'Makes the waves bigger or smaller.'
        },
        {
            name: 'enableFullBarCavaWaveform',
            type: 'boolean',
            default: false,
            description: 'Shows a cava waveform stretching across the entire bar, underneath other widgets.  Does not show when split sections are enabled.'
        },
        {
            name: 'maxMprisTrackInfoTextLength',
            type: 'number',
            default: 30,
            description: 'The max number of characters to display for track info for the mpris_track_info bar widget'
        },
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
                BarWidget.CAVA_WAVEFORM
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
            name: 'expanded',
            type: 'boolean',
            default: true,
            description: 'If true, bar stretches the full monitor height.',
        },
        {
            name: 'splitSections',
            type: 'boolean',
            default: false,
            description: 'If true, widgets are grouped with spacing between sections.',
        },
        {
            name: 'sectionPadding',
            type: 'number',
            default: 0,
            description: 'Padding (px) around each section when splitSections = true.',
        },
        {
            name: 'minimumHeight',
            type: 'number',
            default: 600,
            description: 'Minimum bar height if not expanded.',
            withinConstraints: (value) => value >= 500,
            constraintDescription: 'Must be > 500',
        },
        {
            name: 'widgetSpacing',
            type: 'number',
            default: 0,
            description: 'Spacing (px) between widgets inside the bar.',
        },
        {
            name: 'cavaWaveformLength',
            type: 'number',
            default: 200,
            description: 'Length of the cava waveform.  This has no effect on the full bar waveform.'
        },
        {
            name: 'cavaWaveformExpanded',
            type: 'boolean',
            default: false,
            description: 'Expands the waveform to fill the empty space.  This can expand beyond the set length.  This has no effect on the full bar waveform.'
        },
        {
            name: 'cavaWaveformPosition',
            type: 'enum',
            enumValues: VERTICAL_WAVEFORM_POSITIONS,
            default: VerticalWaveformPosition.OUTER,
            description: 'The base position of the waveform.'
        },
        {
            name: 'cavaWaveformIntensityMultiplier',
            type: 'number',
            default: 1,
            description: 'Makes the waves bigger or smaller.'
        },
        {
            name: 'enableFullBarCavaWaveform',
            type: 'boolean',
            default: false,
            description: 'Shows a cava waveform stretching across the entire bar, underneath other widgets.  Does not show when split sections are enabled.'
        },
        {
            name: 'maxMprisTrackInfoTextLength',
            type: 'number',
            default: 30,
            description: 'The max number of characters to display for track info for the mpris_track_info bar widget'
        },
    ],
} as const satisfies Field // Helper factory to reduce repetition for BarWidget string arrays
