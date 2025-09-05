import {Field} from "../primitiveDefinitions";

export enum SystemMenuWidget {
    AUDIO_IN = "audioIn",
    AUDIO_OUT = "audioOut",
    BLUETOOTH = "bluetooth",
    CLOCK = "clock",
    LOOK_AND_FEEL = "lookAndFeel",
    MPRIS_PLAYERS = "mprisPlayers",
    NETWORK = "network",
    NOTIFICATION_HISTORY = "notificationHistory",
    POWER_OPTIONS = "powerOptions",
    POWER_PROFILE = "powerProfile",
    QUICK_TOGGLES = "quickToggles",
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
