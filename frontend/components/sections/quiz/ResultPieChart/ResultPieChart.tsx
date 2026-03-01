"use client";

import { PieSlices } from "./PieSlices";
import { PerfectCake } from "./PerfectCake";
import { PieLegend } from "./PieLegend";
import { usePieChartGeometry } from "./hooks/usePieChartGeometry";
import type { ResultPieChartProps } from "./types/pieChart.types";
import { useContent } from "@/contexts/LocaleContext";

export function ResultPieChart({
  correct,
  total,
  size = 260,
}: ResultPieChartProps) {
  const { PLAY_QUIZ_TEXT } = useContent();
  const { cx, cy, r, wrong, isPerfect, correctAngle } =
    usePieChartGeometry(correct, total, size);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={PLAY_QUIZ_TEXT.pieChartAria}
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