interface PerfectCakeProps {
  cx: number;
  cy: number;
  r: number;
}

export function PerfectCake({ cx, cy, r }: PerfectCakeProps) {
  return (
    <g className="cake-animation">
      <ellipse cx={cx} cy={cy + r * 0.15} rx={r * 0.35} ry={r * 0.12} fill="#8B4513" />
      <ellipse cx={cx} cy={cy - r * 0.05} rx={r * 0.4} ry={r * 0.25} fill="#FFB6C1" />
      <ellipse cx={cx} cy={cy - r * 0.25} rx={r * 0.35} ry={r * 0.15} fill="#FF69B4" />
      <circle cx={cx} cy={cy - r * 0.35} r={r * 0.03} fill="#FF4500" />
    </g>
  );
}