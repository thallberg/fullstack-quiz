export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export function describeArcSlice(
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

export function usePieChartGeometry(
  correct: number,
  total: number,
  size: number
) {
  const safeTotal = Math.max(total, 1);
  const wrong = Math.max(safeTotal - correct, 0);
  const isPerfect = correct === total && total > 0;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  const correctAngle = (correct / safeTotal) * 360;

  return {
    cx,
    cy,
    r,
    wrong,
    isPerfect,
    correctAngle,
  };
}