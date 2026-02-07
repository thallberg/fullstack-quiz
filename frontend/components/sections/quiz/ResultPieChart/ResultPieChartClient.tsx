"use client";

type ResultPieChartProps = {
  correct: number;
  total: number;
  size?: number;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

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
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function ResultPieChart({ correct, total, size = 260 }: ResultPieChartProps) {
  const safeTotal = Math.max(total, 1);
  const wrong = Math.max(safeTotal - correct, 0);
  const isPerfect = correct === total && total > 0;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const correctRatio = correct / safeTotal;
  const correctAngle = correctRatio * 360;

  const startAngle = 0;
  const correctEndAngle = startAngle + correctAngle;
  const wrongEndAngle = startAngle + 360;

  const showCorrect = correct > 0;
  const showWrong = wrong > 0;

  const correctPath = showCorrect && !isPerfect
    ? describeArcSlice(cx, cy, r, startAngle, correctEndAngle)
    : null;

  const wrongPath = showWrong
    ? describeArcSlice(cx, cy, r, correctEndAngle, wrongEndAngle)
    : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes cakeBounce {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.05);
            }
          }
          .pie-animation {
            animation: fadeInScale 0.8s ease-out;
            transform-origin: ${cx}px ${cy}px;
          }
          .cake-animation {
            animation: fadeInScale 0.8s ease-out 0.3s both, cakeBounce 1.5s ease-in-out 1.1s infinite;
            transform-origin: ${cx}px ${cy}px;
          }
        `
      }} />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Resultat tårtdiagram"
      >
        {wrongPath && (
          <path
            d={wrongPath}
            fill="#ef4444"
            className="pie-animation"
          />
        )}

        {isPerfect ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="#10b981"
            className="pie-animation"
          />
        ) : (
          correctPath && (
            <path
              d={correctPath}
              fill="#10b981"
              className="pie-animation"
            />
          )
        )}

        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#111827"
          strokeOpacity="0.08"
          strokeWidth="2"
        />

        {isPerfect && (
          <g className="cake-animation">
            <ellipse
              cx={cx}
              cy={cy + r * 0.15}
              rx={r * 0.35}
              ry={r * 0.12}
              fill="#8B4513"
            />
            <ellipse
              cx={cx}
              cy={cy - r * 0.05}
              rx={r * 0.4}
              ry={r * 0.25}
              fill="#FFB6C1"
            />
            <ellipse
              cx={cx}
              cy={cy - r * 0.25}
              rx={r * 0.35}
              ry={r * 0.15}
              fill="#FF69B4"
            />
            <circle cx={cx - r * 0.15} cy={cy - r * 0.15} r={r * 0.04} fill="#FFD700" />
            <circle cx={cx} cy={cy - r * 0.2} r={r * 0.04} fill="#FFD700" />
            <circle cx={cx + r * 0.15} cy={cy - r * 0.15} r={r * 0.04} fill="#FFD700" />
            <rect
              x={cx - r * 0.02}
              y={cy - r * 0.4}
              width={r * 0.04}
              height={r * 0.15}
              fill="#FFFF00"
              rx={r * 0.01}
            />
            <circle cx={cx} cy={cy - r * 0.35} r={r * 0.03} fill="#FF4500" />
          </g>
        )}
      </svg>

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
