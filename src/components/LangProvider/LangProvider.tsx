"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  LANG_COOKIE,
  dirOf,
  getDict,
  type Dict,
  type Lang,
} from "@/lib/i18n";

type LangContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (lang: Lang) => void;
};

// Outside the website (admin, employee, login) there is no provider: English
const LangContext = createContext<LangContextValue>({
  lang: "en",
  dir: "ltr",
  t: getDict("en"),
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

export default function LangProvider({
  lang: initial,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const router = useRouter();
  const [lang, setLangState] = useState<Lang>(initial);
  const [prevInitial, setPrevInitial] = useState<Lang>(initial);

  // The server sent a new language (after a refresh): use it
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setLangState(initial);
  }

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      try {
        document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      } catch {}
      // Re-renders the server parts (Home, About, Footer, book page) in the new language
      router.refresh();
    },
    [router]
  );

  const value = useMemo<LangContextValue>(
    () => ({ lang, dir: dirOf(lang), t: getDict(lang), setLang }),
    [lang, setLang]
  );

  return (
    <LangContext.Provider value={value}>
      <div className="site-root" dir={dirOf(lang)} lang={lang}>
        {children}
      </div>
    </LangContext.Provider>
  );
}