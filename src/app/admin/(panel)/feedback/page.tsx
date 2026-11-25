import FeedbackView, {
  type FeedbackItem,
} from "@/components/admin/FeedbackView/FeedbackView";
import { apiFetch } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  let items: FeedbackItem[] = [];
  let failed = false;

  try {
    const res = await apiFetch("/admin/feedback");

    if (res.ok) {
      const data = await res.json();
      items = data.feedback ?? [];
    } else {
      failed = true;
    }
  } catch {
    failed = true;
  }

  return <FeedbackView initial={items} failed={failed} />;
}