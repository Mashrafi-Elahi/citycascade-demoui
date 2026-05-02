import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DICT, toBanglaDigits, type Lang } from "@/lib/i18n";

export type Theme = "dark" | "light";

interface AppCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  tNum: (n: string | number) => string;
}

const Ctx = createContext<AppCtx | null>(null);

const LS_THEME = "cc:theme";
const LS_LANG = "cc:lang";

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate preferences from localStorage on mount.
  useEffect(() => {
    try {
      const savedT = localStorage.getItem(LS_THEME) as Theme | null;
      const savedL = localStorage.getItem(LS_LANG) as Lang | null;
      if (savedT === "light" || savedT === "dark") setThemeState(savedT);
      if (savedL === "en" || savedL === "bn") setLangState(savedL);
    } catch {
      /* ignore */
    }
  }, []);

  // Push theme to <html> class so Tailwind `dark:` + CSS variables react.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.dataset.theme = theme;
    root.lang = lang;
  }, [theme, lang]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(LS_THEME, t);
    } catch {
      /* ignore */
    }
  }, []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LS_LANG, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
  const toggleLang = useCallback(() => setLang(lang === "en" ? "bn" : "en"), [lang, setLang]);

  const t = useCallback(
    (key: string) => {
      const row = DICT[key];
      return row ? row[lang] : key;
    },
    [lang],
  );
  const tNum = useCallback((n: string | number) => toBanglaDigits(n, lang), [lang]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, lang, setLang, toggleLang, t, tNum }),
    [theme, setTheme, toggleTheme, lang, setLang, toggleLang, t, tNum],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
