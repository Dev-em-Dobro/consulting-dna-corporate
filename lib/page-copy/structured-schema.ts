import { z } from "zod";

/** Validate the actual page shape, preserving the positions of cards and steps. */
export function schemaForCopy<T>(defaults: T, fixedLists: string[] = []): z.ZodType<T> {
  function schema(value: unknown, path: string): z.ZodType {
    if (typeof value === "string") return z.string().max(8000);
    if (Array.isArray(value)) {
      if (value.every((item) => typeof item === "string")) {
        const list = z.array(z.string().max(8000));
        return fixedLists.includes(path) ? list.length(value.length) : list.max(48);
      }
      return z.tuple(value.map((item, i) => schema(item, `${path}.${i}`)) as [z.ZodType, ...z.ZodType[]]);
    }
    return z.object(Object.fromEntries(Object.entries(value as object).map(([key, item]) => [
      key, schema(item, path ? `${path}.${key}` : key),
    ])));
  }
  return schema(defaults, "") as z.ZodType<T>;
}
