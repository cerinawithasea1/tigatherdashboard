import type { Book } from './library-data';
import { daysSince, STAGE_META } from './library-data';

interface BookCardProps {
  book: Book;
}

function progressColor(p: number): string {
  if (p >= 80) return 'bg-green-500';
  if (p >= 40) return 'bg-yellow-400';
  return 'bg-sky-400';
}

export function BookCard({ book }: BookCardProps) {
  const days = daysSince(book.stagedAt);
  const isStuck = days >= 7;
  const meta = STAGE_META[book.stage];

  return (
    <div
      className={[
        'bg-gray-900 rounded-xl p-4 border transition-all',
        isStuck
          ? 'border-orange-500/60 ring-1 ring-orange-500/25 shadow-[0_0_12px_0_rgba(249,115,22,0.15)]'
          : 'border-gray-800',
      ].join(' ')}
    >
      {/* Title + stuck badge */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-white leading-snug">{book.title}</p>
        {isStuck && (
          <span className="shrink-0 text-xs font-medium text-orange-400 bg-orange-500/15 border border-orange-500/30 rounded-full px-2 py-0.5">
            🕰 {days}d stuck
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-3">{book.author}</p>

      {/* Narrator + duration */}
      <div className="flex gap-3 text-xs mb-3">
        <span className="flex items-center gap-1 text-gray-400">
          <span className="text-gray-600">🎙</span> {book.narrator}
        </span>
        <span className="flex items-center gap-1 text-gray-400">
          <span className="text-gray-600">⏱</span> {book.duration}
        </span>
      </div>

      {/* Genre pill */}
      <span className="inline-block text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5 mb-3">
        {book.genre}
      </span>

      {/* Progress bar — always shown; full for Done/Shared */}
      <div>
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{book.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progressColor(book.progress)}`}
            style={{ width: `${book.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
