"use client";

import { PieSlices } from "./PieSlices";
import { PerfectCake } from "./PerfectCake";
import { PieLegend } from "./PieLegend";
import { usePieChartGeometry } from "./hook/usePieChartGeometry";

type ResultPieChartProps = {
  correct: number;
  total: number;
  size?: number;
};

export function ResultPieChart({
  correct,
  total,
  size = 260,
}: ResultPieChartProps) {
  const { cx, cy, r, wrong, isPerfect, correctAngle } =
    usePieChartGeometry(correct, total, size);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label="Resultat tårtdiagram"
      >
        <PieSlices
          cx={cx}
          cy={cy}
          r={r}
          correct={correct}
          wrong={wrong}
          correctAngle={correctAngle}
          isPerfect={isPerfect}
        />

        {isPerfect && <PerfectCake cx={cx} cy={cy} r={r} />}
      </svg>

      <PieLegend correct={correct} wrong={wrong} />
    </div>
  );
}