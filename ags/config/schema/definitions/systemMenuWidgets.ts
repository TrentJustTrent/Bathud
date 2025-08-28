import {Field} from "../primitiveDefinitions";

export enum SystemMenuWidget {
    NETWORK = "network",
    BLUETOOTH = "bluetooth",
    AUDIO_OUT = "audioOut",
    AUDIO_IN = "audioIn",
    POWER_PROFILE = "powerProfile",
    LOOK_AND_FEEL = "lookAndFeel",
    MPRIS_PLAYERS = "mprisPlayers",
    POWER_OPTIONS = "powerOptions",
    NOTIFICATION_HISTORY = "notificationHistory",
    TOOLBOX = "toolbox",
    CLOCK = "clock",
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
