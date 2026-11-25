import { notFound } from "next/navigation";
import BookDetail from "@/components/BookDetail/BookDetail";
import ViewCounter from "@/components/ViewCounter/ViewCounter";
import { getBook } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const book = await getBook(id);
  if (!book) notFound();

  return (
    <>
      <ViewCounter bookId={book.id} />
      <BookDetail book={book} />
    </>
  );
}