import Home from "@/components/Home/Home";
import About from "@/components/About/About";
import Books from "@/components/Books/Books";
import Footer from "@/components/Footer/Footer";
import { getBooks, getGroups } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [books, groups] = await Promise.all([getBooks(), getGroups()]);

  return (
    <>
      <Home />
      <About />
      <Books books={books} groups={groups} />
      <Footer />
    </>
  );
}