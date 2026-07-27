"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type JSX,
  type ReactNode,
} from "react";

export type Locale = "en" | "es";
export type Theme = "light" | "dark";

interface SiteContextValue {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

const LOCALE_KEY = "zaz-locale";
const THEME_KEY = "zaz-theme";
const SITE_EVENT = "zaz-site-change";

function emitSiteChange(): void {
  window.dispatchEvent(new Event(SITE_EVENT));
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(SITE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(SITE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  return window.localStorage.getItem(LOCALE_KEY) === "es" ? "es" : "en";
}

function getThemeSnapshot(): Theme {
  return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

function getServerLocale(): Locale {
  return "en";
}

function getServerTheme(): Theme {
  return "dark";
}

export function SiteProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocale,
  );
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerTheme,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
  }, [theme, locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(LOCALE_KEY, next);
    emitSiteChange();
  }, []);

  const setTheme = useCallback((next: Theme) => {
    window.localStorage.setItem(THEME_KEY, next);
    emitSiteChange();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = getThemeSnapshot() === "light" ? "dark" : "light";
    window.localStorage.setItem(THEME_KEY, next);
    emitSiteChange();
  }, []);

  const value = useMemo(
    () => ({ locale, theme, setLocale, setTheme, toggleTheme }),
    [locale, theme, setLocale, setTheme, toggleTheme],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within SiteProvider");
  }
  return context;
}
