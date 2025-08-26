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

] as const satisfies Field[] }
