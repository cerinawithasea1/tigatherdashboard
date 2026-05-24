'use client';

import { INITIAL_BOOKS, STAGES, STAGE_META } from './library-data';
import { BookCard } from './book-card';
import { daysSince } from './library-data';

export function LibraryTab() {
  const books = INITIAL_BOOKS;

  const stuckCount = books.filter((b) => daysSince(b.stagedAt) >= 7).length;

  return (
    <div className="p-6">
      {/* Banner if any stuck books */}
      {stuckCount > 0 && (
        <div className="mb-5 flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3 text-sm text-orange-300">
          <span className="text-base">🕰</span>
          <span>
            <span className="font-semibold">{stuckCount} book{stuckCount > 1 ? 's' : ''}</span>
            {' '}stuck in the same stage for 7+ days — review needed.
          </span>
        </div>
      )}

      {/* Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {STAGES.map((stage) => {
          const col = books.filter((b) => b.stage === stage);
          const meta = STAGE_META[stage];
          return (
            <div key={stage} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 border-b pb-2 ${meta.headerBorder}`}>
                <span className="text-base leading-none">{meta.icon}</span>
                <h2 className={`text-sm font-semibold uppercase tracking-widest ${meta.color}`}>
                  {meta.label}
                </h2>
                <span className="ml-auto text-xs text-gray-600 bg-gray-800 rounded-full px-2 py-0.5">
                  {col.length}
                </span>
              </div>

              {/* Cards */}
              {col.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-8">Empty</p>
              ) : (
                col.map((book) => <BookCard key={book.id} book={book} />)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
