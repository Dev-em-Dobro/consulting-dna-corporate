import type { EditorField } from "./fields.ts";

export type TextNode = string | TextNode[] | { [key: string]: TextNode };
export type TextObject = { [key: string]: TextNode };

const NON_TEXT_KEYS = new Set([
  "slug", "image", "cardImage", "heroImage", "heroImagePosition", "imagePosition",
  "icon", "src", "alt", "caseSlug", "diagram", "logoSize", "sectionLayout",
  "capabilitiesTone", "capabilitiesLayout",
]);

/** Extract words while leaving image paths, icons and layout settings in code. */
export function textCopyOf(value: unknown): TextNode | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => textCopyOf(item) ?? {});
  if (!value || typeof value !== "object") return undefined;
  const entries = Object.entries(value).flatMap(([key, item]) => {
    if (NON_TEXT_KEYS.has(key)) return [];
    const copy = textCopyOf(item);
    return copy === undefined ? [] : [[key, copy] as const];
  });
  return Object.fromEntries(entries);
}

/** Apply only existing text leaves; structural fields and absent blocks survive. */
export function applyTextCopy<T>(base: T, copy: unknown): T {
  if (typeof base === "string") {
    return (typeof copy === "string" && copy.trim() ? copy : base) as T;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(copy)) return base;
    if (base.every((item) => typeof item === "string")) {
      return (copy.length ? copy.map((item, i) => applyTextCopy(base[i] ?? "", item)) : base) as T;
    }
    return base.map((item, i) => applyTextCopy(item, copy[i])) as T;
  }
  if (!base || typeof base !== "object" || !copy || typeof copy !== "object") return base;
  return Object.fromEntries(Object.entries(base).map(([key, value]) => [
    key,
    NON_TEXT_KEYS.has(key) ? value : applyTextCopy(value, (copy as Record<string, unknown>)[key]),
  ])) as T;
}

const humanize = (key: string) => key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

export function fieldsForCopy(value: TextNode, path: string, label = ""): EditorField[] {
  if (typeof value === "string") return [{
    path,
    label,
    kind: /body|description|paragraph|quote|answer|lead|note|summary|text/i.test(path) || value.length > 120 || value.includes("\n") ? "textarea" : "text",
  }];
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) return [{
      path, label, kind: /paragraphs/i.test(path) ? "paragraphs" : "lines",
      hint: /paragraphs/i.test(path) ? "Separate paragraphs with an empty line." : "One item per line.",
    }];
    return value.flatMap((item, i) => fieldsForCopy(item, `${path}.${i}`, `${label} ${i + 1}`));
  }
  return Object.entries(value).flatMap(([key, item]) => fieldsForCopy(
    item, path ? `${path}.${key}` : key, label ? `${label}  -  ${humanize(key)}` : humanize(key),
  ));
}
