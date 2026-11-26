import { LoadingLabel, Skeleton } from "@/components/Skeleton/Skeleton";

export default function Loading() {
  return (
    <div className="skl-stack" aria-busy="true" style={{ gap: 24 }}>
      <LoadingLabel />

      <div className="skl-stack">
        <Skeleton width={260} height={32} />
        <Skeleton width="45%" height={16} />
      </div>

      <div className="skl-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="adm-card">
            <Skeleton height={64} radius={14} />
          </div>
        ))}
      </div>

      <div className="adm-card skl-stack">
        <Skeleton width={200} height={22} />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={44} />
        ))}
      </div>
    </div>
  );
}