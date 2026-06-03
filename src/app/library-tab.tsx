'use client';

import { useApi } from './use-api';

interface Book {
  title: string;
  author: string;
  status: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'found':     { bg: 'bg-sky-500/10',    text: 'text-sky-400',    border: 'border-sky-500/20',    label: '📥 Found' },
  'downloading': { bg: 'bg-yellow-500/10', text: 'text-yellow-300', border: 'border-yellow-500/20', label: '⬇️ Downloading' },
  'done':      { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20',  label: '✅ Done' },
  'shared':    { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: '🔗 Shared' },
  'unknown':   { bg: 'bg-gray-500/10',   text: 'text-gray-400',   border: 'border-gray-500/20',   label: '❓ Unknown' },
};

function getStatusStyle(status: string) {
  const key = status.toLowerCase();
  return STATUS_STYLES[key] || STATUS_STYLES['unknown'];
}

export function LibraryTab() {
  const { data, loading, lastUpdated } = useApi<Book[]>('/api/library', []);

  // Group books by status
  const grouped = data.reduce((acc, book) => {
    const status = book.status?.toLowerCase() || 'unknown';
    if (!acc[status]) acc[status] = [];
    acc[status].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  const statuses = Object.keys(grouped).sort();
  const total = data.length;

  return (
    <div className="p-6">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-3 text-xs">
          <span className="bg-gray-800 rounded-full px-3 py-1 text-gray-400">
            <span className="text-white font-semibold">{total}</span> books
          </span>
          {statuses.map((status) => {
            const style = getStatusStyle(status);
            return (
              <span key={status} className={`${style.bg} border ${style.border} rounded-full px-3 py-1 ${style.text}`}>
                <span className="font-semibold">{grouped[status].length}</span> {style.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-600 py-12 text-sm">Loading library...</div>
      )}

      {/* Books grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((book, i) => {
            const style = getStatusStyle(book.status);
            return (
              <div
                key={`${book.title}-${i}`}
                className={`rounded-xl border ${style.border} ${style.bg} p-4 hover:scale-[1.01] transition-transform`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-white leading-tight">{book.title}</h3>
                  <span className={`text-xs whitespace-nowrap ${style.text}`}>{style.label}</span>
                </div>
                {book.author && (
                  <p className="text-xs text-gray-400 mb-1">{book.author}</p>
                )}
                <p className="text-xs text-gray-600 font-mono">Status: {book.status}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          <p className="text-lg mb-2">📚</p>
          <p className="text-sm">No books in the library yet.</p>
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-xs text-gray-600 mt-3 text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
