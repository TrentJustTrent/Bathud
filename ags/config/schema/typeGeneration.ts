// ───────────────────────────────────────────────
//  Type‑generation helpers – compile‑time only
// ───────────────────────────────────────────────
import {Field, PrimitiveType} from "./primitiveDefinitions";

type PrimitiveByKind<K extends PrimitiveType> =
    K extends 'string' ? string :
        K extends 'number' ? number :
            K extends 'boolean' ? boolean :
                K extends 'color' ? string :
                    never
type FieldToProp<F extends Field> =
    F['type'] extends 'object'
        ? SchemaToType<F['children']>
        : F['type'] extends 'array'
            ? FieldToProp<NonNullable<F['item']>>[]
            : F['type'] extends 'enum'
                ? (F['enumValues'] extends readonly (infer E)[] ? E : string)
                : PrimitiveByKind<F['type' & PrimitiveType]>
export type SchemaToType<S extends readonly Field[] | undefined> =
    S extends readonly Field[]
        ? { [K in S[number] as K['name']]: FieldToProp<K> }
        : unknown