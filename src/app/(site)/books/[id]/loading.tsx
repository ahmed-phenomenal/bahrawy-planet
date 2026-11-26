import { LoadingLabel, Skeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className="skl-page" aria-busy="true">
      <LoadingLabel />
      <Skeleton width={110} height={38} radius={999} />

      <div className="skl-detail">
        <Skeleton height={460} radius={18} />

        <div className="skl-stack">
          <Skeleton width="70%" height={34} />
          <Skeleton width="35%" height={20} />
          <Skeleton width={120} height={30} />
          <Skeleton height={14} />
          <Skeleton height={14} />
          <Skeleton width="85%" height={14} />
          <Skeleton width="60%" height={14} />
          <Skeleton width={160} height={44} radius={999} />
        </div>
      </div>
    </div>
  );
}