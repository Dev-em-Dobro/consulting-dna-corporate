"use client";

import { useEffect } from "react";
import ptBr from "@/messages/pt-BR-visible.json";
import profileCopy from "@/messages/pt-BR-profiles.json";

const translations: Record<string, string> = { ...ptBr, ...profileCopy };
const attributes = ["alt", "aria-label", "placeholder", "title"] as const;

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** Translate rendered copy while the existing English route tree is retained. */
export default function LocaleRuntime() {
  useEffect(() => {
    const locale = document.cookie.match(/(?:^|;\s*)site_locale=([^;]+)/)?.[1];
    const portuguese = locale === "pt-BR";
    document.documentElement.lang = portuguese ? "pt-BR" : "en";
    document.documentElement.dataset.siteLocale = portuguese ? "pt-BR" : "en";

    if (!portuguese) {
      document.documentElement.classList.remove("site-i18n-pending");
      return;
    }

    const translate = (value: string) => {
      const key = normalize(value);
      const translated = translations[key];
      if (translated === undefined || translated === key) return value;
      const leading = value.match(/^\s*/)?.[0] ?? "";
      const trailing = value.match(/\s*$/)?.[0] ?? "";
      return `${leading}${translated}${trailing}`;
    };

    const translateElement = (element: Element) => {
      if (element.closest("script,style,noscript,code,pre,[data-no-translate]")) return;
      for (const attribute of attributes) {
        const value = element.getAttribute(attribute);
        if (value) {
          const translated = translate(value);
          if (translated !== value) element.setAttribute(attribute, translated);
        }
      }
    };

    const translateText = (node: Text) => {
      if (node.parentElement?.closest("script,style,noscript,code,pre,[data-no-translate]")) return;
      const translated = translate(node.data);
      if (translated !== node.data) node.data = translated;
    };

    const translateTree = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        translateText(root as Text);
        return;
      }
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      const element = root as Element;
      translateElement(element);
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeType === Node.TEXT_NODE) translateText(node as Text);
        else translateElement(node as Element);
      }
    };

    // Next's head manager may update <title> after hydration. Keep it in sync
    // without touching the English route or canonical URL.
    const translateTitle = () => {
      const translated = translate(document.title);
      if (translated !== document.title) document.title = translated;
    };
    translateTitle();
    const headObserver = new MutationObserver(translateTitle);
    headObserver.observe(document.head, { subtree: true, childList: true, characterData: true });
    translateTree(document.body);
    document.documentElement.classList.remove("site-i18n-pending");
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target);
        if (mutation.type === "attributes") translateTree(mutation.target);
        for (const node of mutation.addedNodes) translateTree(node);
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...attributes],
    });
    return () => {
      observer.disconnect();
      headObserver.disconnect();
    };
  }, []);

  return null;
}
