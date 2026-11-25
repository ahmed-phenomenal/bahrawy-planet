import Navbar from "@/components/Navbar/Navbar";
import LangProvider from "@/components/LangProvider/LangProvider";
import { getLang } from "@/lib/langServer";
import "./site.css";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getLang();

  return (
    <LangProvider lang={lang}>
      <Navbar />
      <main>{children}</main>
    </LangProvider>
  );
}