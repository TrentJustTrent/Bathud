import {Field} from "../primitiveDefinitions";

export const windowsSchema = {
    name: 'windows',
    type: 'object',
    description: 'Global window styling defaults.',
    children: [
        {
            name: 'gaps',
            type: 'number',
            default: 5,
            description: 'Gap (px) between windows.',
        },
        {
            name: 'borderRadius',
            type: 'number',
            default: 8,
            description: 'Corner radius (px) for client‑side decorations.',
        },
        {
            name: 'borderWidth',
            type: 'number',
            default: 2,
            description: 'Window border width (px).',
        },
    ],
} as const satisfies Field