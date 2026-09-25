import { z } from 'zod'

/** Strips the wrappers that don't change what the user types into (optional, pipes, defaults). */
function unwrap(schema: z.ZodType): z.ZodType {
    let current = schema
    for (;;) {
        if (current instanceof z.ZodPipe) current = current.in as z.ZodType
        else if (
            current instanceof z.ZodOptional ||
            current instanceof z.ZodNullable ||
            current instanceof z.ZodDefault
        )
            current = current.unwrap() as z.ZodType
        else return current
    }
}

/**
 * The `.max()` of the string at a react-hook-form path ("steps.2.title") in a zod object
 * schema, or `undefined` when the path isn't a string with a maximum. Lets a form give each
 * input the exact `maxLength` its schema enforces, so the browser stops typing at the limit
 * instead of the error showing up on save.
 */
export function schemaMaxLength(schema: z.ZodType, path: string): number | undefined {
    let current: z.ZodType | undefined = schema
    for (const segment of path.split('.')) {
        current = unwrap(current)
        if (current instanceof z.ZodArray && /^\d+$/.test(segment)) {
            current = current.element as z.ZodType
        } else if (current instanceof z.ZodObject) {
            current = (current.shape as Record<string, z.ZodType | undefined>)[segment]
            if (!current) return undefined
        } else {
            return undefined
        }
    }
    current = unwrap(current)
    return current instanceof z.ZodString ? (current.maxLength ?? undefined) : undefined
}
