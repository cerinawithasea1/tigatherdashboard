interface PlaceholderPanelProps {
  name: string;
}

export function PlaceholderPanel({ name }: PlaceholderPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-500">
      <span className="text-5xl mb-4">🚧</span>
      <p className="text-lg font-semibold">{name}</p>
      <p className="text-sm mt-1">Coming Soon</p>
    </div>
  );
}
