import {Field} from "../primitiveDefinitions";

export enum SystemMenuWidget {
    NETWORK = "network",
    BLUETOOTH = "bluetooth",
    AUDIO_OUT = "audio_out",
    AUDIO_IN = "audio_in",
    POWER_PROFILE = "power_profile",
    LOOK_AND_FEEL = "look_and_feel",
    MPRIS_PLAYERS = "mpris_players",
    POWER_OPTIONS = "power_options",
    NOTIFICATION_HISTORY = "notification_history",
    TOOLBOX = "toolbox",
    CLOCK = "clock",
    SCREEN_RECORDING_CONTROLS = "screen_recording_controls",
}

export const SYSTEM_MENU_WIDGET_VALUES = Object.values(SystemMenuWidget) as readonly SystemMenuWidget[]

export function systemMenuWidgetsSchema() { return [
    {
        name: SystemMenuWidget.CLOCK,
        type: 'object',
        description: 'Configurations for the system menu clock.',
        children: [
            {
                name: "dayAllCaps",
                type: 'boolean',
                default: false,
                description: "If the week day name text should be in all caps",
            },
            {
                name: "dayFont",
                type: "string",
                default: {from: "theme.font"},
                description: "Font used for the week day name",
                reactive: false,
            }
        ]
    }
] as const satisfies Field[] }
