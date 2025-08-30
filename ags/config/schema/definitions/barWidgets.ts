import {Field} from "../primitiveDefinitions";

export enum BarWidget {
    MENU = "menu",
    WORKSPACES = "workspaces",
    CLOCK = "clock",
    AUDIO_OUT = "audioOut",
    AUDIO_IN = "audioIn",
    BLUETOOTH = "bluetooth",
    NETWORK = "network",
    RECORDING_INDICATOR = "recordingIndicator",
    VPN_INDICATOR = "vpnIndicator",
    BATTERY = "battery",
    TRAY = "tray",
    APP_LAUNCHER = "appLauncher",
    SCREENSHOT = "screenshot",
    CLIPBOARD_MANAGER = "clipboardManager",
    POWER_PROFILE = "powerProfile",
    CAVA_WAVEFORM = "cavaWaveform",
    MPRIS_CONTROLS = "mprisControls",
    MPRIS_TRACK_INFO = "mprisTrackInfo",
    MPRIS_PRIMARY_PLAYER_SWITCHER = "mprisPrimaryPlayerSwitcher",
    NOTIFICATION_HISTORY = "notificationHistory",
    COLOR_PICKER = "colorPicker",
    LOGOUT = "logout",
    LOCK = "lock",
    RESTART = "restart",
    SHUTDOWN = "shutdown",
    TIMER = "timer",
}
export const BAR_WIDGET_VALUES = Object.values(BarWidget) as readonly BarWidget[]

export enum WaveformPosition {
    INNER = "inner",
    OUTER = "outer",
    START = "start",
    END = "end",
}
export const WAVEFORM_POSITIONS = Object.values(WaveformPosition) as readonly WaveformPosition[]

export enum Alignment {
    START = "start",
    CENTER = "center",
    END = "end"
}
export const ALIGNMENT_VALUES = Object.values(Alignment) as readonly Alignment[]

function widgetCommons(
    reactiveForeground: boolean = false,
    reactiveBackground: boolean = false,
    reactiveBorderRadius: boolean = false,
    reactiveBorderWidth: boolean = false,
    reactiveBorderColor: boolean = false,
    foregroundDefault: string = 'barWidgets.widgetForeground',
) { return [
    {
        name: 'foreground',
        type: 'color',
        default: {from: foregroundDefault},
        description: 'Foreground color of the widget.',
        reactive: reactiveForeground,
    },
    {
        name: 'background',
        type: 'color',
        default: {from: 'barWidgets.widgetBackground'},
        description: 'Background color of the widget.',
        reactive: reactiveBackground,
    },
    {
        name: 'borderRadius',
        type: 'number',
        default: {from: 'barWidgets.widgetBorderRadius'},
        description: 'Corner radius (px) for the widget.',
        reactive: reactiveBorderRadius,
    },
    {
        name: 'borderWidth',
        type: 'number',
        default: {from: "barWidgets.widgetBorderWidth"},
        description: 'Widget border width (px).',
        reactive: reactiveBorderWidth,
    },
    {
        name: 'borderColor',
        type: 'color',
        default: {from: 'barWidgets.widgetBorderColor'},
        description: 'Color of the widget border',
        reactive: reactiveBorderColor,
    },
    {
        name: 'marginStart',
        type: 'number',
        default: 0,
        description: "Margin at the start of the widget.",
        withinConstraints: (value) => value >= 0,
        constraintDescription: 'Must be >= 0',
    },
    {
        name: 'marginEnd',
        type: 'number',
        default: 0,
        description: "Margin at the end of the widget.",
        withinConstraints: (value) => value >= 0,
        constraintDescription: 'Must be >= 0',
    },
    {
        name: 'marginTop',
        type: 'number',
        default: 0,
        description: "Margin at the top of the widget.",
        withinConstraints: (value) => value >= 0,
        constraintDescription: 'Must be >= 0',
    },
    {
        name: 'marginBottom',
        type: 'number',
        default: 0,
        description: "Margin at the bottom of the widget.",
        withinConstraints: (value) => value >= 0,
        constraintDescription: 'Must be >= 0',
    }
] as const satisfies Field[] }

export const barWidgetsSchema = {
    name: 'barWidgets',
    type: 'object',
    description: 'Theming configurations for the bars.',
    children: [
        {
            name: 'widgetForeground',
            type: 'color',
            default: {from: 'theme.colors.foreground'},
            description: 'Foreground color of the bar widgets.',
            reactive: false,
        },
        {
            name: 'widgetBackground',
            type: 'color',
            default: {from: 'theme.colors.background'},
            description: 'Background color of the bar widgets.',
            reactive: false,
        },
        {
            name: 'widgetBorderRadius',
            type: 'number',
            default: 8,
            description: 'Corner radius (px) for bar widgets.',
            reactive: false,
        },
        {
            name: 'widgetBorderWidth',
            type: 'number',
            default: 0,
            description: 'Widget border width (px).',
            reactive: false,
        },
        {
            name: 'widgetBorderColor',
            type: 'color',
            default: {from: 'theme.colors.primary'},
            description: 'Color of the widget borders',
            reactive: false,
        },
        {
            name: BarWidget.MENU,
            type: "object",
            description: "Theme configuration for the menu bar widget.",
            children: [
                ...widgetCommons(),
                {
                    name: 'icon',
                    type: 'icon',
                    default: '',
                    description: 'Icon shown on the menu button (ex: Nerd Font glyph).',
                },
                {
                    name: 'iconOffset',
                    type: 'number',
                    default: 1,
                    description: 'Offset of the menu button icon.  Use this if the icon is not centered properly'
                },
            ],
        },
        {
            name: BarWidget.WORKSPACES,
            type: "object",
            description: "Configuration for the workspaces bar widget.",
            children: [
                ...widgetCommons(),
                {
                    name: 'largeActive',
                    type: 'boolean',
                    default: false,
                    description: 'Make the active workspace icon larger'
                },
                {
                    name: 'activeIcon',
                    type: 'icon',
                    default: "",
                    description: 'Icon of the active workspace'
                },
                {
                    name: 'activeOffset',
                    type: 'number',
                    default: 1,
                    description: 'Offset of the active workspace icon.  Use this if the icon is not centered properly'
                },
                {
                    name: 'inactiveIcon',
                    type: 'icon',
                    default: "",
                    description: 'Icon of the inactive workspace'
                },
                {
                    name: 'inactiveOffset',
                    type: 'number',
                    default: 1,
                    description: 'Offset of the active workspace icon.  Use this if the icon is not centered properly'
                },
                {
                    name: 'inactiveForeground',
                    type: 'color',
                    default: {from: 'barWidgets.workspaces.foreground'},
                    description: 'Foreground color of inactive workspaces.',
                    reactive: false,
                },
            ],
        },
        {
            name: BarWidget.CLOCK,
            type: "object",
            description: "Configuration for the clock bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.AUDIO_OUT,
            type: "object",
            description: "Configuration for the audio out bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.AUDIO_IN,
            type: "object",
            description: "Configuration for the audio in bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.BLUETOOTH,
            type: "object",
            description: "Configuration for the bluetooth bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.NETWORK,
            type: "object",
            description: "Configuration for the network bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.RECORDING_INDICATOR,
            type: "object",
            description: "Configuration for the recording indicator bar widget.",
            children: [...widgetCommons(
                false,
                false,
                false,
                false,
                false,
                'theme.colors.warning'
            )],
        },
        {
            name: BarWidget.VPN_INDICATOR,
            type: "object",
            description: "Configuration for the vpn indicator bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.BATTERY,
            type: "object",
            description: "Configuration for the battery bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.TRAY,
            type: "object",
            description: "Configuration for the tray bar widget.",
            children: [
                ...widgetCommons(),
                {
                    name: 'collapsable',
                    type: 'boolean',
                    default: true,
                    description: 'If true, a tray icon will show and need to be clicked to reveal the tray apps.'
                }
            ],
        },
        {
            name: BarWidget.APP_LAUNCHER,
            type: "object",
            description: "Configuration for the app launcher bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.SCREENSHOT,
            type: "object",
            description: "Configuration for the screenshot bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.CLIPBOARD_MANAGER,
            type: "object",
            description: "Configuration for the clipboardManager bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.POWER_PROFILE,
            type: "object",
            description: "Configuration for the power profile bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.CAVA_WAVEFORM,
            type: "object",
            description: "Configuration for the cava waveform bar widget.",
            children: [
                ...widgetCommons(true),
                {
                    name: 'length',
                    type: 'number',
                    default: 200,
                    description: 'Length of the cava waveform.  This has no effect on the full bar waveform.',
                    withinConstraints: value => value >= 100,
                    constraintDescription: 'Must be >= 100'
                },
                {
                    name: 'expanded',
                    type: 'boolean',
                    default: false,
                    description: 'Expands the waveform to fill the empty space.  This can expand beyond the set length.  This has no effect on the full bar waveform.'
                },
                {
                    name: 'position',
                    type: 'enum',
                    enumValues: WAVEFORM_POSITIONS,
                    default: WaveformPosition.OUTER,
                    description: 'The base position of the waveform'
                },
                {
                    name: 'intensityMultiplier',
                    type: 'number',
                    default: 1,
                    description: 'Makes the waves bigger or smaller.',
                    withinConstraints: value => value >= 0,
                    constraintDescription: 'Must be >= 0'
                },
            ],
        },
        {
            name: BarWidget.MPRIS_CONTROLS,
            type: "object",
            description: "Configuration for the mprisControls bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.MPRIS_TRACK_INFO,
            type: "object",
            description: "Configuration for the mpris track info bar widget.",
            children: [
                ...widgetCommons(
                    true,
                ),
                {
                    name: 'textLength',
                    type: 'number',
                    default: 30,
                    description: 'The max number of characters to display.'
                },
                {
                    name: 'textAlignment',
                    type: 'enum',
                    enumValues: ALIGNMENT_VALUES,
                    default: Alignment.CENTER,
                    description: 'How to align the text.'
                },
                {
                    name: 'minimumLength',
                    type: 'number',
                    default: 300,
                    description: 'The minimum length of the widget.'
                }
            ],
        },
        {
            name: BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER,
            type: "object",
            description: "Configuration for the mpris primary player switcher bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.NOTIFICATION_HISTORY,
            type: "object",
            description: "Configuration for the notification history bar widget.",
            children: [
                ...widgetCommons(),
                {
                    name: 'indicatorForeground',
                    type: 'color',
                    default: {from: 'theme.colors.warning'},
                    description: 'Foreground color of the unread notification indicator.',
                    reactive: false,
                },
            ],
        },
        {
            name: BarWidget.COLOR_PICKER,
            type: "object",
            description: "Configuration for the color picker bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.LOGOUT,
            type: "object",
            description: "Configuration for the logout bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.LOCK,
            type: "object",
            description: "Configuration for the lock bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.RESTART,
            type: "object",
            description: "Configuration for the restart bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.SHUTDOWN,
            type: "object",
            description: "Configuration for the shutdown bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.TIMER,
            type: "object",
            description: "Configuration for the timer bar widget.",
            children: [...widgetCommons()],
        },
    ],
} as const satisfies Field