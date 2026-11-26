import { LoadingLabel, Skeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className="skl-page" aria-busy="true">
      <LoadingLabel />
      <Skeleton width={260} height={32} />
      <Skeleton height={140} radius={16} />
      <Skeleton height={260} radius={16} />
    </div>
  );
}