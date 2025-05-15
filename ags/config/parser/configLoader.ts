import {Field, PrimitiveType} from "../schema/primitiveDefinitions";
import {Config} from "../types/derivedTypes";
import {CONFIG_SCHEMA} from "../schema/definitions/root";
import {parseYaml} from "./yamlParser";


// ───────────────────────── helpers ─────────────────────────
const stripQuotes = (s: string) => s.replace(/^"|"$/g, '').replace(/^'|'$/g, '');

function castPrimitive(value: string, target: PrimitiveType) {
    switch (target) {
        case 'number': {
            const n = Number(value);
            if (Number.isNaN(n)) throw new Error(`Expected number, got "${value}"`);
            return n;
        }
        case 'boolean':
            if (value === 'true' || value === 'false') return value === 'true';
            throw new Error(`Expected boolean, got "${value}"`);
        default:
            return stripQuotes(value);
    }
}

function isHexColor(value: string): boolean {
    return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

// ───────────────────────── validation ─────────────────────────
export function validateAndApplyDefaults<T>(
    raw: Record<string, any>,
    schema: Field[],
    path: string = "",
    defaults?: Record<string, any>
): T {
    const out: any = {};
    const recurse = (r: any, s: Field[], path: string, d?: Record<string, any>): any =>
        validateAndApplyDefaults(r ?? {}, s, path, d);

    for (const f of schema) {
        const key = f.name;
        const rawValue = raw?.[key];
        const defaultValue = defaults?.[key];
        const value = f.transformation ? f.transformation(rawValue) : rawValue;
        let keyPath
        if (path === "") {
            keyPath = key
        } else {
            keyPath = `${path}.${key}`
        }

        const resolvedValue = value !== undefined ? value : defaultValue;

        if (resolvedValue !== undefined && f.withinConstraints !== undefined && !f.withinConstraints(resolvedValue)) {
            throw new Error(
                `Invalid config value for ${keyPath}: ${resolvedValue}; ${f.constraintDescription}`
            )
        }

        // ── Missing key ─────────────────────────────────────────────
        if (resolvedValue === undefined) {
            if (f.type === 'object') {
                // Even if not explicitly provided, build object from child defaults
                out[key] = recurse({}, f.children ?? [], keyPath, defaultValue);
                continue;
            }
            if (f.default !== undefined) {
                out[key] = f.default;
                continue;
            }
            if (f.required) throw new Error(`Missing required config value: ${keyPath}`);
            out[key] = undefined;
            continue;
        }

        // ── Present key – validate according to type ────────────────
        switch (f.type) {
            case 'string':
            case 'number':
            case 'boolean':
                out[key] = castPrimitive(String(resolvedValue), f.type);
                break;

            case 'color':
                if (!isHexColor(resolvedValue)) throw new Error(`Invalid config value for ${keyPath}: ${resolvedValue}`)
                out[key] = castPrimitive(String(resolvedValue), f.type);
                break;

            case 'icon':
                const str = String(resolvedValue).trim();
                if (Array.from(str).length !== 1) {
                    throw new Error(`Invalid config value for ${keyPath}: expected a single glyph but got "${resolvedValue}"`);
                }
                out[key] = str;
                break;

            case 'enum':
                if (!f.enumValues!.includes(resolvedValue)) throw new Error(`Invalid config value for ${keyPath}: ${resolvedValue}`);
                out[key] = resolvedValue;
                break;

            case 'object':
                out[key] = recurse(resolvedValue, f.children ?? [], keyPath, defaultValue);
                break;

            case 'array': {
                if (!Array.isArray(resolvedValue)) throw new Error(`Expected array for config value ${keyPath}`);
                const item = f.item!;
                out[key] = resolvedValue.map((v) => {
                    if (item.type === 'enum') {
                        if (!item.enumValues!.includes(v)) throw new Error(`Invalid config value in ${keyPath}: ${v}`);
                        return v;
                    }
                    if (item.type === 'object') return recurse(v, item.children ?? [], keyPath);
                    return castPrimitive(String(v), item.type as PrimitiveType);
                });
                break;
            }
        }
    }
    return out as T;
}

// ────────────────────────────────────────────────────────────────────────────
// Public helper – load & validate config from file
// ────────────────────────────────────────────────────────────────────────────
export function loadConfig(path: string, defaults?: Record<string, any>): Config {
    const raw = parseYaml(path)
    return validateAndApplyDefaults(raw, CONFIG_SCHEMA, "", defaults);
}
