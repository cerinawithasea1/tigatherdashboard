interface HealthBarProps {
  label: string;
  value: number;
}

function barColor(value: number): string {
  if (value >= 80) return 'bg-red-500';
  if (value >= 60) return 'bg-yellow-400';
  return 'bg-green-500';
}

export function HealthBar({ label, value }: HealthBarProps) {
  return (
    <div className="flex-1 bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        <span className="text-sm font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
