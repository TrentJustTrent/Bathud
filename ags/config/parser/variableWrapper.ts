import {Field} from "../schema/primitiveDefinitions";
import {SchemaToType, VariableSchemaToType} from "../types/typeGeneration";
import {Variable} from "astal";
import {timeout} from "astal/time";

/**
 * This function will take a Schema object and turn it into a new, nearly identical object,
 * but the leaf values will be wrapped in a reactive object.
 */
export function wrapConfigInVariables<T extends readonly Field[]>(
    schema: T,
    config: SchemaToType<T>
): VariableSchemaToType<T> {
    const result: any = {};
    for (const field of schema) {
        const value = config[field.name as keyof typeof config];
        if (field.type === 'object' && field.children) {
            result[field.name] = wrapConfigInVariables(field.children, value as any);
        } else if (field.type === 'array' && field.item) {
            if (field.item.type === 'object') {
                result[field.name] = new Variable(
                    (value as any[]).map(item =>
                        wrapConfigInVariables(field.item!.children!, item)
                    )
                );
            } else {
                result[field.name] = new Variable(value);
            }
        } else {
            result[field.name] = new Variable(value);
        }
    }
    return result;
}

let newVarsCount: number = 0
let listUpdateDelay: number = 10000

/**
 * This function updates all the reactive values in the wrapped object to match the newConfig values.
 */
export function updateVariablesFromConfig<T extends readonly Field[]>(
    schema: T,
    wrapped: VariableSchemaToType<T>,
    newConfig: SchemaToType<T>,
    root: boolean = true,
): void {
    if (root) {
        newVarsCount = 0
        listUpdateDelay = 10000
    }
    for (const field of schema) {
        const name = field.name;
        const newValue = newConfig[name as keyof typeof newConfig];

        if (field.reactive === false) {
            (wrapped as any)[name] = newValue;
            continue;
        }

        const wrappedValue = wrapped[name as keyof typeof wrapped];

        if (field.type === 'object' && field.children) {
            updateVariablesFromConfig(
                field.children,
                wrappedValue as any,
                newValue as any,
                false,
            );
        } else if (field.type === 'array' && field.item) {
            const currentValue = (wrappedValue as Variable<any>).get();

            if (field.item.type === 'object') {
                // Always set because we regenerate wrapped objects
                const arr = (newValue as any[]).map(item =>
                    wrapConfigInVariables(field.item!.children!, item)
                );
                console.log(`Variable changed: ${name}`)
                newVarsCount += 1;
                (wrappedValue as Variable<any>).set(arr);
            } else {
                // Shallow array equality check
                if (!arraysEqual(currentValue, newValue)) {
                    console.log(`Variable changed: ${name}`);
                    newVarsCount += 1;
                    (wrappedValue as Variable<any>).set(newValue);
                }
            }
        } else {
            const currentValue = (wrappedValue as Variable<any>).get();
            if (currentValue !== newValue) {
                console.log(`Variable changed: ${name}`)
                newVarsCount += 1;
                (wrappedValue as Variable<any>).set(newValue);
            }
        }
    }
    if (root) {
        console.log(`Variables changed: ${newVarsCount}`)
    }
}

function arraysEqual(a: any[], b: any[]): boolean {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}