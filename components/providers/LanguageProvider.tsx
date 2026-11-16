'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { translateText } from '@/lib/i18n/translations';

export type Language = 'en' | 'id';

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({ language: 'en', setLanguage: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const textStates = useRef(new WeakMap<Text, { original: string; translated: string }>());
  const attributeStates = useRef(new WeakMap<Element, Map<string, { original: string; translated: string }>>());

  useEffect(() => {
    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const current = textNode.nodeValue ?? '';
        const previous = textStates.current.get(textNode);
        const original = previous && current === previous.translated ? previous.original : current;
        const translated = translateText(original, language);
        textStates.current.set(textNode, { original, translated });
        if (translated !== current) textNode.nodeValue = translated;
        return;
      }
      if (!(node instanceof Element)) return;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)) return;
      const states = attributeStates.current.get(node) ?? new Map();
      for (const attribute of ['placeholder', 'aria-label', 'title', 'alt']) {
        if (!node.hasAttribute(attribute)) continue;
        const current = node.getAttribute(attribute) ?? '';
        const previous = states.get(attribute);
        const original = previous && current === previous.translated ? previous.original : current;
        const translated = translateText(original, language);
        states.set(attribute, { original, translated });
        if (translated !== current) node.setAttribute(attribute, translated);
      }
      attributeStates.current.set(node, states);
      node.childNodes.forEach(translateNode);
    };

    if (document.body) translateNode(document.body);
    document.documentElement.lang = language === 'id' ? 'id' : 'en';
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') translateNode(record.target);
        else record.addedNodes.forEach(translateNode);
        if (record.type === 'attributes') translateNode(record.target);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title', 'alt'] });
    return () => observer.disconnect();
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
