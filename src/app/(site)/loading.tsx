import { LoadingLabel, Skeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className="skl-page" aria-busy="true">
      <LoadingLabel />

      <Skeleton height={340} radius={20} />

      <div className="skl-stack">
        <Skeleton width={220} height={30} />
        <div className="skl-row">
          <Skeleton width={110} height={38} radius={999} />
          <Skeleton width={130} height={38} radius={999} />
          <Skeleton width={120} height={38} radius={999} />
          <Skeleton width={100} height={38} radius={999} />
        </div>
      </div>

      <div className="skl-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skl-card">
            <Skeleton height={290} radius={14} />
            <Skeleton width="80%" height={18} />
            <Skeleton width="50%" height={14} />
          </div>
        ))}
      </div>
    </div>
  );
}