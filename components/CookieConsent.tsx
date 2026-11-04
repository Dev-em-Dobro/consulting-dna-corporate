"use client";

import { useEffect, useRef, useState } from "react";
import { COOKIE_ACCEPTED_EVENT, COOKIE_CONSENT_KEY, COOKIE_SETTINGS_EVENT } from "@/lib/analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
    } catch {
      /* localStorage unavailable  -  don't block the page */
    }
  }, []);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  /* ESTA BARRA COME OS ÚLTIMOS ~85px DE TODA PRIMEIRA VISITA, e ela é `fixed`
     com z-9999, então nada que se ancore embaixo aparece por baixo dela. Quem
     sofre primeiro é a seta de rolagem do herói (`.h-cue`): ela existe para o
     visitante de primeira viagem, que é exatamente quem tem o banner na tela.

     Em vez de cada elemento chutar uma altura, a barra PUBLICA a sua em
     `--consent-h` e some com a variável ao sair. Medida e não fixa porque o
     texto reflui: no telefone a barra empilha e passa dos 150px.

     É `bottom`, e não `transform`, quem lê a variável do outro lado  -  a seta
     tem a entrada do GSAP escrita no transform dela, e duas coisas disputando
     a mesma propriedade foi o defeito que este arranjo evita. */
  useEffect(() => {
    const el = barRef.current;
    const root = document.documentElement;
    if (!el) {
      root.style.removeProperty("--consent-h");
      return;
    }
    const publish = () =>
      root.style.setProperty("--consent-h", `${Math.round(el.offsetHeight)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--consent-h");
    };
  }, [visible]);

  const decide = (value: "accepted" | "declined") => {
    let wasAccepted = false;
    try {
      wasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    if (value === "accepted") {
      window.dispatchEvent(new Event(COOKIE_ACCEPTED_EVENT));
    } else if (wasAccepted) {
      for (const item of document.cookie.split(";")) {
        const name = item.trim().split("=")[0];
        if (name === "_ga" || name.startsWith("_ga_")) {
          document.cookie = `${name}=; Max-Age=0; Path=/`;
          document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${location.hostname}`;
        }
      }
      window.location.reload();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-white/10 bg-ink text-white"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="max-w-[720px] text-[13.5px] leading-relaxed text-white/80">
          We use cookies to improve your experience and analyse site usage. By
          clicking “Accept”, you consent to our use of cookies.
        </p>
        <div className="flex flex-none gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="cursor-pointer border border-white/30 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:border-white/60"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="cursor-pointer bg-brand px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
