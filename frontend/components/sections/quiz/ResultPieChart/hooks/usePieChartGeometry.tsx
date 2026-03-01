export function usePieChartGeometry(
  correct: number,
  total: number,
  size: number
) {
  const safeTotal = Math.max(total, 1)
  const wrong = Math.max(safeTotal - correct, 0)
  const isPerfect = correct === total && total > 0

  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38

  const correctAngle = (correct / safeTotal) * 360

  return {
    cx,
    cy,
    r,
    wrong,
    isPerfect,
    correctAngle,
  }
}
