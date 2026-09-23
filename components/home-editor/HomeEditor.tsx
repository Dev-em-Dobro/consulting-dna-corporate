"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_HOME_COPY,
  EDITOR_SECTIONS,
  fromInput,
  getAtPath,
  setAtPath,
  toInput,
  type EditorField,
  type HomeCopy,
} from "@/lib/home-copy";

/**
 * O EDITOR DA HOME — uma coluna de seções, na ordem da página, cada uma com
 * seus campos; barra fixa no topo com o estado e o botão de salvar.
 *
 * DIRIGIDO POR DADOS: a lista de campos é `EDITOR_SECTIONS` em `lib/home-copy`.
 * Para expor um texto novo, é acrescentar o campo lá; esta tela não sabe o que
 * cada campo é, só o `kind`.
 *
 * TAMANHO DAS CAIXAS: `textarea` cresce com o conteúdo por script, e não por
 * `field-sizing: content`, porque o Safari (o iPhone da cliente) não tem a
 * propriedade.
 */
type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

export default function HomeEditor({ initial }: { initial: HomeCopy }) {
  const [copy, setCopy] = useState<HomeCopy>(initial);
  const [saved, setSaved] = useState<HomeCopy>(initial);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const dirty = useMemo(() => JSON.stringify(copy) !== JSON.stringify(saved), [copy, saved]);

  // Aviso do navegador ao fechar a aba com mudança não salva.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const update = useCallback((field: EditorField, text: string) => {
    setCopy((prev) => setAtPath(prev, field.path, fromInput(field.kind, text)));
    setStatus((s) => (s.kind === "saved" || s.kind === "error" ? { kind: "idle" } : s));
  }, []);

  const resetField = useCallback((field: EditorField) => {
    setCopy((prev) => setAtPath(prev, field.path, getAtPath(DEFAULT_HOME_COPY, field.path)));
  }, []);

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/home-copy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(copy),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Could not save.");
      setSaved(data.copy ?? copy);
      setCopy(data.copy ?? copy);
      setStatus({ kind: "saved" });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  // Ctrl/Cmd+S salva.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && status.kind !== "saving") void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, status.kind, copy]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* O banner de cookies e o botão do WhatsApp vêm do layout raiz e não
          fazem sentido numa tela de trabalho — o banner ainda cobria o botão
          de salvar do rodapé. Escondidos só aqui, por atributo. */}
      <style>{`[aria-label="Cookie consent"],[aria-label="Chat with us on WhatsApp"]{display:none!important}`}</style>
      {/* Barra do topo */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1360px] items-center gap-4 px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-brand">Corporate DNA</p>
            <h1 className="truncate text-[20px] font-semibold leading-tight">Home page text</h1>
          </div>
          <StatusPill status={status} dirty={dirty} />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden text-[14px] font-medium text-ink underline underline-offset-4 hover:text-brand sm:inline"
          >
            View site ↗
          </a>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status.kind === "saving"}
            className="bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/25"
          >
            {status.kind === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-10 lg:grid-cols-[180px_1fr]">
        {/* Índice de seções */}
        <nav className="hidden lg:block">
          <ol className="sticky top-24 space-y-1 text-[14px]">
            {EDITOR_SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#s-${s.id}`} className="flex gap-2 py-1 text-muted hover:text-brand">
                  <span className="w-5 text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="space-y-8">
          <p className="max-w-[640px] text-[15px] leading-relaxed text-muted">
            Edit any text below and click <strong className="text-ink">Save changes</strong>. The home page updates
            within a few seconds. Leave a field empty to restore its original text.
          </p>

          {EDITOR_SECTIONS.map((s, i) => (
            <section key={s.id} id={`s-${s.id}`} className="scroll-mt-24 border border-line bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
                <h2 className="text-[17px] font-semibold">
                  <span className="mr-2 text-[12px] font-semibold text-brand">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <a
                  href={s.anchor}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] text-muted underline underline-offset-4 hover:text-brand"
                >
                  See on site ↗
                </a>
              </div>
              {/* O PRINT DA SEÇÃO FICA AO LADO DOS CAMPOS, e acompanha a rolagem
                  (sticky): com 19 campos no Client impact, uma imagem só no
                  topo já teria saído da tela quando ela chega no card 3.
                  Os arquivos vêm de `scripts/edit-home-guide-shots.mjs`. */}
              <div className="grid gap-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_440px]">
                <div className="grid gap-5 md:grid-cols-2">
                {s.fields.map((f) => (
                  <Field
                    key={f.path}
                    field={f}
                    value={toInput(f.kind, getAtPath(copy, f.path))}
                    changed={getAtPath(copy, f.path) !== getAtPath(saved, f.path)}
                    isDefault={
                      JSON.stringify(getAtPath(copy, f.path)) === JSON.stringify(getAtPath(DEFAULT_HOME_COPY, f.path))
                    }
                    onChange={(t) => update(f, t)}
                    onReset={() => resetField(f)}
                  />
                ))}
                </div>
                <aside className="xl:order-none order-first">
                  <figure className="xl:sticky xl:top-24">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/edit-home-guide/${s.id}.jpg`}
                      alt={`How the “${s.title}” section looks on the site`}
                      loading="lazy"
                      className="w-full border border-line bg-paper"
                    />
                    <figcaption className="mt-2 text-[12px] leading-snug text-muted">
                      How this section looks on the site. The picture does not update as you type — save and open
                      the site to see your changes.
                    </figcaption>
                  </figure>
                </aside>
              </div>
            </section>
          ))}

          <div className="flex items-center justify-end gap-4 pb-16">
            <StatusPill status={status} dirty={dirty} />
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status.kind === "saving"}
              className="bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              {status.kind === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusPill({ status, dirty }: { status: Status; dirty: boolean }) {
  let text = "All changes saved";
  let tone = "text-muted";
  if (status.kind === "saving") text = "Saving…";
  else if (status.kind === "error") {
    text = status.message ?? "Could not save";
    tone = "text-brand";
  } else if (status.kind === "saved" && !dirty) {
    text = "Saved — the site updates in a few seconds";
    tone = "text-emerald-700";
  } else if (dirty) {
    text = "Unsaved changes";
    tone = "text-ink";
  }
  return <span className={`text-[13px] font-medium ${tone}`}>{text}</span>;
}

function Field({
  field,
  value,
  changed,
  isDefault,
  onChange,
  onReset,
}: {
  field: EditorField;
  value: string;
  changed: boolean;
  isDefault: boolean;
  onChange: (text: string) => void;
  onReset: () => void;
}) {
  const multiline = field.kind !== "text";
  const wide = multiline || field.label.toLowerCase().includes("heading");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);

  const base =
    "w-full border bg-white px-3.5 py-2.5 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand";
  const border = changed ? "border-brand/60" : "border-line";

  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-semibold uppercase tracking-[1px] text-ink/70">{field.label}</span>
        {!isDefault && (
          <button
            type="button"
            onClick={onReset}
            className="text-[12px] text-muted underline underline-offset-2 hover:text-brand"
          >
            Restore original
          </button>
        )}
      </span>
      {multiline ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={`${base} ${border} resize-none overflow-hidden`}
          style={{ fontFamily: field.kind === "lines" ? undefined : "var(--font-serif, Georgia, serif)" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} ${border}`}
        />
      )}
      {field.hint && <span className="mt-1 block text-[12px] text-muted">{field.hint}</span>}
    </label>
  );
}
