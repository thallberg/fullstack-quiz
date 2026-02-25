import { describeArcSlice } from "./hook/usePieChartGeometry";


interface PieSlicesProps {
  cx: number;
  cy: number;
  r: number;
  correct: number;
  wrong: number;
  correctAngle: number;
  isPerfect: boolean;
}

export function PieSlices({
  cx,
  cy,
  r,
  correct,
  wrong,
  correctAngle,
  isPerfect,
}: PieSlicesProps) {
  const startAngle = 0;
  const correctEndAngle = startAngle + correctAngle;
  const wrongEndAngle = 360;

  const correctPath =
    correct > 0 && !isPerfect
      ? describeArcSlice(cx, cy, r, startAngle, correctEndAngle)
      : null;

  const wrongPath =
    wrong > 0
      ? describeArcSlice(cx, cy, r, correctEndAngle, wrongEndAngle)
      : null;

  return (
    <>
      {wrongPath && (
        <path d={wrongPath} fill="#ef4444" className="pie-animation" />
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
          <path d={correctPath} fill="#10b981" className="pie-animation" />
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
    </>
  );
}