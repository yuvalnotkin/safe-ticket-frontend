"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import he from "./dictionaries/he.json";
import en from "./dictionaries/en.json";
import type { Dictionary, Language, TranslationKey } from "./types";

// Client component because language is user-switchable state. Server still
// renders with Hebrew (see layout.tsx); the provider keeps it reactive on
// the client and syncs <html lang/dir> when the user toggles (Sprint 1.3).

const DICTIONARIES: Record<Language, Dictionary> = { he, en };

type LanguageContextValue = {
  language: Language;
  setLanguage: (next: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function lookup(dict: Dictionary, key: string): string {
  const segments = key.split(".");
  let current: unknown = dict;
  for (const segment of segments) {
    if (typeof current !== "object" || current === null) return key;
    current = (current as Record<string, unknown>)[segment];
  }
  return typeof current === "string" ? current : key;
}

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language;
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  // Keep <html lang/dir> in sync when the user toggles. Cheap DOM write,
  // runs only on change, and avoids a hydration mismatch on first paint.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = DICTIONARIES[language];
    return {
      language,
      setLanguage,
      t: (key) => lookup(dict, key),
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
