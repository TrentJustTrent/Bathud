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
            name: 'lock',
            type: 'string',
            required: true,
            description: 'Command to lock the screen.',
        },
        {
            name: 'restart',
            type: 'string',
            required: true,
            description: 'Command to reboot the machine.',
        },
        {
            name: 'shutdown',
            type: 'string',
            required: true,
            description: 'Command to shut down the machine safely.',
        },
    ],
} as const satisfies Field