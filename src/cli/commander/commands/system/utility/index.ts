import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import AstalWp from 'gi://AstalWp?version=0.1';
import { Command } from '../../../types';
import { execAsync } from 'ags/process';
import { getSystrayItems } from '../../../../helpers/systray';
import { errorHandler } from '../../../helpers/utils';
import options from 'src/configuration';
import { decreaseVolume, increaseVolume, muteVolume } from '../../../../../widgets/utils/audio';
import { variableConfig } from '../../../../../config/config';

const notifdService = AstalNotifd.get_default();
const audio = AstalWp.get_default();

export const utilityCommands: Command[] = [
    {
        name: 'Test',
        aliases: ['marco'],
        description: 'Reply to test if cli commands work',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                return 'Polo!';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'systrayItems',
        aliases: ['sti'],
        description: 'Gets a list of IDs for the current applications in the system tray.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                return getSystrayItems() ?? 'No items found!';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'clearNotifications',
        aliases: ['cno'],
        description: 'Clears all of the notifications that currently exist.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                const allNotifications = notifdService.get_notifications();
                allNotifications.notifications.forEach((notification) => {
                    notification.dismiss()
                })

                return 'Notifications cleared successfully.';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'toggleDnd',
        aliases: ['dnd'],
        description: 'Toggled the Do Not Disturb mode for notifications.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                notifdService.set_dont_disturb(!notifdService.dontDisturb);

                return notifdService.dontDisturb ? 'Enabled' : 'Disabled';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'adjustVolume',
        aliases: ['vol'],
        description: 'Adjusts the volume of the default audio output device.',
        category: 'System',
        args: [
            {
                name: 'volume',
                description: 'Adjust the volume up, down, or mute',
                type: 'string',
                required: true,
            },
        ],
        handler: (args: Record<string, unknown>): string => {
            try {

                const volume = String(args['volume']).toLowerCase();
                if (volume == 'up') {
                    increaseVolume()
                } else if (volume == 'down') {
                    decreaseVolume()
                } else if (volume == 'mute') {
                    muteVolume()
                    return 'Volume Muted'
                } else {
                    return `Up, down, or mute are the only allowed values`
                }
                return `Adjusted volume by ${variableConfig.sounds.volumeIncrement.peek()}`;
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'restart',
        aliases: ['r'],
        description: 'Restarts Bathud.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                execAsync('bash -c "bathud -q; bathud"');
                return '';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
    {
        name: 'quit',
        aliases: ['q'],
        description: 'Quits Bathud.',
        category: 'System',
        args: [],
        handler: (): string => {
            try {
                execAsync('bash -c "bathud -q"');
                return '';
            } catch (error) {
                errorHandler(error);
            }
        },
    },
];
