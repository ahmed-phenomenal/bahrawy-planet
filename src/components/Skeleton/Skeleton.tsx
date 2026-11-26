import "./Skeleton.css";

export function Skeleton({
  width = "100%",
  height = 16,
  radius,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
}) {
  return (
    <span
      className="skl"
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function LoadingLabel() {
  return (
    <span className="skl-sr" role="status">
      Loading...
    </span>
  );
}