interface PieLegendProps {
  correct: number;
  wrong: number;
}

export function PieLegend({ correct, wrong }: PieLegendProps) {
  return (
    <div className="flex items-center gap-6">
      <LegendItem color="#10b981" label="rätt" value={correct} />
      <LegendItem color="#ef4444" label="fel" value={wrong} />
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