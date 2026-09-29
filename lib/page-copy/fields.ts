/**
 * O MAPA DO EDITOR e os utilitários de caminho — o que é IGUAL para toda página
 * editável (`/edit-home`, `/edit-about`).
 *
 * Saiu de `lib/home-copy.ts` em 23-09, quando a About pediu o mesmo editor. O
 * que ficou lá é só conteúdo: os padrões da home e a lista de campos dela. O
 * formato de um campo, a leitura/escrita por caminho e a conversão entre o
 * texto do controle e o valor no objeto são os mesmos nas duas, e agora moram
 * aqui.
 *
 * ⚠️ ESTE ARQUIVO É NEUTRO DE PÁGINA E DE AMBIENTE. Nada de `fs`, `blob`, zod
 * ou variável de ambiente — ele é importado pelo servidor, pelos testes do Node
 * e (por tipo) pelo editor no cliente.
 */

/**
 * O controle que a tela desenha para o campo:
 *   `text`        uma linha
 *   `textarea`    parágrafo
 *   `lines`       lista, uma por linha
 *   `paragraphs`  lista, um parágrafo por bloco separado por linha em branco
 */
export type FieldKind = "text" | "textarea" | "lines" | "paragraphs";

/** `path` é o caminho dentro do objeto de copy: `a.b.0.c`. */
export type EditorField = { path: string; label: string; kind: FieldKind; hint?: string };

/**
 * Uma seção do editor. `anchor` é o link "See on site" — caminho e âncora da
 * página real. `id` casa com o print do guia (`public/<guideDir>/<id>.jpg`).
 */
export type EditorSection = { id: string; title: string; anchor: string; fields: EditorField[] };

/** Lê `a.b.0.c` de dentro do objeto. */
export function getAtPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Devolve uma CÓPIA do objeto com `a.b.0.c` trocado — nunca muta o original. */
export function setAtPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = (node: unknown, i: number): unknown => {
    if (i === keys.length) return value;
    const key = keys[i];
    if (Array.isArray(node)) {
      const next = node.slice();
      next[Number(key)] = clone(node[Number(key)], i + 1);
      return next;
    }
    const src = (node ?? {}) as Record<string, unknown>;
    return { ...src, [key]: clone(src[key], i + 1) };
  };
  return clone(obj, 0) as T;
}

/** Texto do controle → valor no objeto, conforme o `kind`. */
export function fromInput(kind: FieldKind, text: string): unknown {
  if (kind === "lines") return text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (kind === "paragraphs") return text.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
  return text;
}

/** Valor no objeto → texto do controle. */
export function toInput(kind: FieldKind, value: unknown): string {
  if (Array.isArray(value)) return value.join(kind === "paragraphs" ? "\n\n" : "\n");
  return typeof value === "string" ? value : "";
}
