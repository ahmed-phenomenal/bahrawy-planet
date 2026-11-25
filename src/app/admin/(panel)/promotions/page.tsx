import PromotionsView, {
  type BookItem,
  type Category,
} from "@/components/admin/PromotionsView/PromotionsView";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function load(path: string): Promise<any> {
  try {
    const res = await apiFetch(path);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const [groups, books] = await Promise.all([
    load("/categories"),
    load("/admin/books"),
  ]);

  const categories: Category[] = (groups ?? []).flatMap((g: any) =>
    (g.categories ?? []).map((c: any) => ({ id: c.id, name: c.name }))
  );

  const items: BookItem[] = [...(books ?? [])]
    .sort((a: any, b: any) => b.id - a.id)
    .map((b: any) => ({
      id: Number(b.id),
      title: String(b.title ?? ""),
      meta: `${b.author} · ${b.category?.name ?? ""} · EGP ${Number(b.price)} · ${
        b.stock_quantity ?? 0
      } in storage`,
    }));

  return <PromotionsView categories={categories} items={items} />;
}