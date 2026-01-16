"use client";

type ResultPieChartProps = {
  correct: number;
  total: number;
  size?: number; // px
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

// Bygger en "pie slice" path från startAngle till endAngle
function describeArcSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`, // start i centrum
    `L ${start.x} ${start.y}`, // linje till arc-start
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, // själva bågen
    "Z", // stäng
  ].join(" ");
}

export function ResultPieChart({ correct, total, size = 260 }: ResultPieChartProps) {
  const safeTotal = Math.max(total, 1);
  const wrong = Math.max(safeTotal - correct, 0);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38; // storlek på tårtan

  const correctRatio = correct / safeTotal;
  const correctAngle = correctRatio * 360;

  // Starta vid 12:00
  const startAngle = 0;
  const correctEndAngle = startAngle + correctAngle;
  const wrongEndAngle = startAngle + 360;

  // Specialfall: 0 eller 100%
  const showCorrect = correct > 0;
  const showWrong = wrong > 0;

  const correctPath = showCorrect
    ? describeArcSlice(cx, cy, r, startAngle, correctEndAngle)
    : null;

  const wrongPath = showWrong
    ? describeArcSlice(cx, cy, r, correctEndAngle, wrongEndAngle)
    : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Resultat tårtdiagram"
      >
        {/* Fel (röd) */}
        {wrongPath && <path d={wrongPath} fill="#ef4444" />}

        {/* Rätt (grön) */}
        {correctPath && <path d={correctPath} fill="#10b981" />}

        {/* tunn kant för tydlighet */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#111827"
          strokeOpacity="0.08"
          strokeWidth="2"
        />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: "#10b981" }} />
          <span className="text-sm text-gray-700">
            <strong>{correct}</strong> rätt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
          <span className="text-sm text-gray-700">
            <strong>{wrong}</strong> fel
          </span>
        </div>
      </div>
    </div>
  );
}
