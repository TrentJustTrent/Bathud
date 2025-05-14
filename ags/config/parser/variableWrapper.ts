import {Field} from "../schema/primitiveDefinitions";
import {SchemaToType, VariableSchemaToType} from "../types/typeGeneration";
import {Variable} from "astal";

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