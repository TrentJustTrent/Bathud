import {Field} from "../primitiveDefinitions";

export const systemCommandsSchema = {
    name: 'systemCommands',
    type: 'object',
    description: 'Shell commands executed by power options.',
    required: true,
    children: [
        {
            name: 'logout',
            type: 'string',
            required: true,
            description: 'Command to log the current user out.',
        },
        {
            name: 'logoutConfirmationEnabled',
            type: 'boolean',
            default: true,
            description: 'Enable a confirmation dialog when logging out.'
        },
        {
            name: 'lock',
            type: 'string',
            required: true,
            description: 'Command to lock the screen.',
        },
        {
            name: 'lockConfirmationEnabled',
            type: 'boolean',
            default: false,
            description: 'Enable a confirmation dialog when locking the screen.'
        },
        {
            name: 'restart',
            type: 'string',
            required: true,
            description: 'Command to reboot the machine.',
        },
        {
            name: 'restartConfirmationEnabled',
            type: 'boolean',
            default: true,
            description: 'Enable a confirmation dialog when restarting the computer.'
        },
        {
            name: 'shutdown',
            type: 'string',
            required: true,
            description: 'Command to shut down the machine safely.',
        },
        {
            name: 'shutdownConfirmationEnabled',
            type: 'boolean',
            default: true,
            description: 'Enable a confirmation dialog when shutting the computer down.'
        },
    ],
} as const satisfies Field