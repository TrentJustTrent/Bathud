import {Field} from "../primitiveDefinitions";
import {BarWidget} from "./barWidgets";

function widgetCommons() { return [
    {
        name: 'foreground',
        type: 'color',
        default: {from: 'theme.bars.widgetForeground'},
        description: 'Foreground color of the widget.'
    },
    {
        name: 'background',
        type: 'color',
        default: {from: 'theme.bars.widgetBackground'},
        description: 'Background color of the widget.'
    },
    {
        name: 'borderRadius',
        type: 'number',
        default: {from: 'theme.bars.widgetBorderRadius'},
        description: 'Corner radius (px) for the widget.',
    },
    {
        name: 'borderWidth',
        type: 'number',
        default: {from: "theme.bars.widgetBorderWidth"},
        description: 'Widget border width (px).',
    },
    {
        name: 'borderColor',
        type: 'color',
        default: {from: 'theme.bars.widgetBorderColor'},
        description: 'Color of the widget border'
    },
] as const satisfies Field[] }

export const themeBarsSchema = {
    name: 'bars',
    type: 'object',
    description: 'Theming configurations for the bars.',
    children: [
        {
            name: 'borderRadius',
            type: 'number',
            default: 8,
            description: 'Corner radius (px) for bars.',
        },
        {
            name: 'borderWidth',
            type: 'number',
            default: 2,
            description: 'Bar border width (px).',
        },
        {
            name: 'borderColor',
            type: 'color',
            default: {from: 'theme.colors.primary'},
            description: 'Color of the bar border'
        },
        {
            name: 'backgroundColor',
            type: 'color',
            default: {from: 'theme.colors.background'},
            description: 'Color of the bar background'
        },
        {
            name: 'widgetForeground',
            type: 'color',
            default: {from: 'theme.colors.foreground'},
            description: 'Foreground color of the bar widgets.'
        },
        {
            name: 'widgetBackground',
            type: 'color',
            default: {from: 'theme.colors.background'},
            description: 'Background color of the bar widgets.'
        },
        {
            name: 'widgetBorderRadius',
            type: 'number',
            default: 8,
            description: 'Corner radius (px) for bar widgets.',
        },
        {
            name: 'widgetBorderWidth',
            type: 'number',
            default: 0,
            description: 'Widget border width (px).',
        },
        {
            name: 'widgetBorderColor',
            type: 'color',
            default: {from: 'theme.colors.primary'},
            description: 'Color of the widget borders'
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
            description: "Configuration for the audio_out bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.AUDIO_IN,
            type: "object",
            description: "Configuration for the audio_in bar widget.",
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
            description: "Configuration for the recording_indicator bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.VPN_INDICATOR,
            type: "object",
            description: "Configuration for the vpn_indicator bar widget.",
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
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.APP_LAUNCHER,
            type: "object",
            description: "Configuration for the app_launcher bar widget.",
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
            description: "Configuration for the clipboard_manager bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.POWER_PROFILE,
            type: "object",
            description: "Configuration for the power_profile bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.CAVA_WAVEFORM,
            type: "object",
            description: "Configuration for the cava_waveform bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.MPRIS_CONTROLS,
            type: "object",
            description: "Configuration for the mpris_controls bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.MPRIS_TRACK_INFO,
            type: "object",
            description: "Configuration for the mpris_track_info bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.MPRIS_PRIMARY_PLAYER_SWITCHER,
            type: "object",
            description: "Configuration for the mpris_primary_player_switcher bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.NOTIFICATION_HISTORY,
            type: "object",
            description: "Configuration for the notification_history bar widget.",
            children: [...widgetCommons()],
        },
        {
            name: BarWidget.COLOR_PICKER,
            type: "object",
            description: "Configuration for the color_picker bar widget.",
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
    ],
} as const satisfies Field