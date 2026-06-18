type PointsBadgeProps = {
  points: number | null;
  size?: "sm" | "md";
};

export function PointsBadge({ points, size = "md" }: PointsBadgeProps) {
  if (points === null) {
    return (
      <span className="rounded-full bg-boludo-card-muted px-2.5 py-0.5 text-xs font-medium text-boludo-muted">
        —
      </span>
    );
  }

  const styleClass =
    points === 5
      ? "points-exact"
      : points === 3
        ? "points-winner"
        : "points-zero";

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${styleClass} ${sizeClass}`}
    >
      {points} pts
    </span>
  );
}
