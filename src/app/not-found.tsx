import Image from "next/image";
import Link from "next/link";
import { dirOf, getDict } from "@/lib/i18n";
import { getLang } from "@/lib/langServer";
import "./not-found.css";

export default async function NotFound() {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <div className="nf" dir={dirOf(lang)} lang={lang}>
      <Image
        src="/not-found.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="nf-image"
      />
      <h1 className="nf-sr">{t.notFound.title}</h1>
      <Link href="/" className="nf-button">
        {t.notFound.back}
      </Link>
    </div>
  );
}