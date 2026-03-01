import type { PieLegendProps } from "./types/pieChart.types";
import { useContent } from "@/contexts/LocaleContext";

export function PieLegend({ correct, wrong }: PieLegendProps) {
  const { RESULT_PIE_CHART_TEXT } = useContent();

  return (
    <div className="flex items-center gap-6">
      <LegendItem color="#10b981" label={RESULT_PIE_CHART_TEXT.correct} value={correct} />
      <LegendItem color="#ef4444" label={RESULT_PIE_CHART_TEXT.wrong} value={wrong} />
    </div>
  );
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ background: color }} />
      <span className="text-sm text-gray-700">
        <strong>{value}</strong> {label}
      </span>
    </div>
  );
}