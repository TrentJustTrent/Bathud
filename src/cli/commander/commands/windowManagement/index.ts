import { Command } from '../../types';
import { App } from 'ags/gtk4';
import { errorHandler, windowClose, windowToggles } from '../../helpers/utils';

export const windowManagementCommands: Command[] = [
    {
        name: 'closeWindow',
        aliases: ['c'],
        description: 'Closes the specified window.',
        category: 'Window Management',
        args: [
            {
                name: 'window',
                description: 'The name of the window to close.',
                type: 'string',
                required: true,
            },
        ],
        handler: async (args: Record<string, unknown>): Promise<string> => {
            try {
                const windowName = args['window'] as string;

                const foundWindow = windowClose.has(windowName);

                if (!foundWindow) {
                    throw new Error(`Window ${args['window']} not found.`);
                }

                windowClose.get(windowName)();

                return `Closed window ${args['window'] as string}`;
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'toggleWindow',
        aliases: ['t'],
        description: 'Toggles the visibility of a specified window.',
        category: 'Window Management',
        args: [
            {
                name: 'window',
                description: 'The name of the window to toggle.',
                type: 'string',
                required: true,
            },
        ],
        handler: async (args: Record<string, unknown>): Promise<string> => {
            try {
                const windowName = args['window'] as string;

                const foundWindow = windowToggles.has(windowName);

                if (!foundWindow) {
                    throw new Error(`Window ${args['window']} not found.`);
                }

                windowToggles.get(windowName)();

                return `Toggled window ${args['window'] as string}`;
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'listWindows',
        aliases: ['lw'],
        description: 'Gets a list of all HyprPanel windows.',
        category: 'Window Management',
        args: [],
        handler: (): string => {
            try {
                const windowList = App.get_windows().map((window) => window.name);
                return windowList.join('\n');
            } catch (error) {
                errorHandler(error);
            }
        },
    },
];
