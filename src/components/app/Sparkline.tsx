import { bandOf } from "@/lib/mock-data";

export function Sparkline({
  data,
  width = 96,
  height = 28,
  className = "",
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const stepX = width / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = data[data.length - 1];
  const first = data[0];
  const stroke =
    last < first - 2
      ? "var(--color-load-high-foreground)"
      : last > first + 2
      ? "var(--color-load-low-foreground)"
      : "var(--color-muted-foreground)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      preserveAspectRatio="none"
    >
      <polyline
        points={points.join(" ")}
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HealthBadge({ health }: { health: number }) {
  const band = bandOf(health);
  const styles =
    band === "healthy"
      ? "bg-load-low text-load-low-foreground"
      : band === "watch"
      ? "bg-load-medium text-load-medium-foreground"
      : "bg-load-high text-load-high-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {health}
    </span>
  );
}
