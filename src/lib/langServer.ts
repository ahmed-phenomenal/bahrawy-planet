import { cookies } from "next/headers";
import { DEFAULT_LANG, LANG_COOKIE, isLang, type Lang } from "@/lib/i18n";

// The language the visitor chose (saved in a cookie). English by default.
export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    const value = store.get(LANG_COOKIE)?.value;
    return isLang(value) ? value : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}