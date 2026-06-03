'use client';

import { useState } from 'react';
import { useApi } from './use-api';

interface JournalEntry {
  sister: string;
  file: string;
  title: string;
  lines: number;
  size: number;
}

const SISTER_COLOR: Record<string, string> = {
  Sage:   'text-green-400',
  River:  'text-blue-400',
  Wisp:   'text-purple-400',
  Cerina: 'text-pink-400',
};

const SISTER_EMOJI: Record<string, string> = {
  Sage:   '🌿',
  River:  '🌊',
  Wisp:   '🔥',
  Cerina: '✨',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function extractDate(filename: string): string {
  // Try to extract date from filename like "2026-05-30-under-the-tree.md"
  const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) return dateMatch[1];
  return filename;
}

export function SessionsTab() {
  const { data, loading, lastUpdated } = useApi<JournalEntry[]>('/api/sessions', []);
  const [filter, setFilter] = useState<'all' | string>('all');

  const sorted = [...data].sort((a, b) => {
    // Sort by filename date descending
    return b.file.localeCompare(a.file);
  });

  const filtered = filter === 'all'
    ? sorted
    : sorted.filter((s) => s.sister.toLowerCase() === filter);

  const sisterCounts = data.reduce((acc, entry) => {
    acc[entry.sister] = (acc[entry.sister] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sisters = Object.keys(SISTER_COLOR);

  return (
    <div className="p-6">
      {/* Stats + filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-3 text-xs">
          <span className="bg-gray-800 rounded-full px-3 py-1 text-gray-400">
            <span className="text-white font-semibold">{data.length}</span> journals
          </span>
          {sisters.map((s) => (
            <span key={s} className="bg-gray-800 rounded-full px-3 py-1 text-gray-400">
              <span className={`font-semibold ${SISTER_COLOR[s]}`}>{sisterCounts[s] || 0}</span> {SISTER_EMOJI[s]}
            </span>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={[
              'px-3 py-1 rounded-md transition-colors',
              filter === 'all'
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-gray-300',
            ].join(' ')}
          >
            All
          </button>
          {sisters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s.toLowerCase())}
              className={[
                'px-3 py-1 rounded-md transition-colors',
                filter === s.toLowerCase()
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              {SISTER_EMOJI[s]} {s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-gray-600 py-12 text-sm">Loading journals...</div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-widest text-gray-500 bg-gray-900/80">
                <th className="text-left px-4 py-3 font-medium">Sister</th>
                <th className="text-left px-4 py-3 font-medium">Journal</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-right px-4 py-3 font-medium">Lines</th>
                <th className="text-right px-4 py-3 font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={`${entry.sister}-${entry.file}`}
                  className={[
                    'border-t border-gray-800 transition-colors',
                    i % 2 === 0
                      ? 'bg-transparent hover:bg-gray-800/40'
                      : 'bg-gray-900/30 hover:bg-gray-800/40',
                  ].join(' ')}
                >
                  {/* Sister */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-semibold ${SISTER_COLOR[entry.sister] || 'text-gray-400'}`}>
                      {SISTER_EMOJI[entry.sister] || '📝'} {entry.sister}
                    </span>
                  </td>

                  {/* File */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400 font-mono text-xs">
                    {extractDate(entry.file)}
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3 text-gray-300 text-xs leading-relaxed">
                    {entry.title}
                  </td>

                  {/* Lines */}
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                    {entry.lines}
                  </td>

                  {/* Size */}
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-500">
                    {formatBytes(entry.size)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-600 py-12 text-sm">No journals match this filter.</p>
          )}
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
