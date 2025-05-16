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
}
export const SYSTEM_MENU_WIDGET_VALUES = Object.values(SystemMenuWidget) as readonly SystemMenuWidget[]

export const systemMenuWidgetsArrayField = <N extends string>( //preserve the literal key
    name: N,
    description: string,
    defaults: readonly SystemMenuWidget[],
) =>
    ({
        name,
        type: "array",
        description,
        default: defaults,
        item: {
            name: "widget",
            type: "enum",
            enumValues: SYSTEM_MENU_WIDGET_VALUES,
        },
    } as const satisfies Field & { name: N })

export const systemMenuSchema = {
    name: 'systemMenu',
    type: 'object',
    description: 'System menu configurations.',
    children: [
        systemMenuWidgetsArrayField(
            'widgets',
            'Widgets inside the system menu',
            [
                SystemMenuWidget.NETWORK,
                SystemMenuWidget.BLUETOOTH,
                SystemMenuWidget.AUDIO_OUT,
                SystemMenuWidget.AUDIO_IN,
                SystemMenuWidget.TOOLBOX,
                SystemMenuWidget.LOOK_AND_FEEL,
                SystemMenuWidget.MPRIS_PLAYERS,
                SystemMenuWidget.POWER_OPTIONS,
                SystemMenuWidget.NOTIFICATION_HISTORY
            ]
        ),
    ],
} as const satisfies Field
