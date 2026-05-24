'use client';

import { useState } from 'react';
import { SESSIONS, SISTER_COLOR, formatDuration, formatTime } from './sessions-data';
import type { Session } from './sessions-data';

const STATUS_STYLES: Record<Session['status'], string> = {
  completed:  'bg-green-500/15 text-green-400 border border-green-500/30',
  'timed-out':'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
};

const STATUS_LABEL: Record<Session['status'], string> = {
  completed:  'Completed',
  'timed-out':'Timed Out',
};

export function SessionsTab() {
  const [filter, setFilter] = useState<'all' | Session['status']>('all');

  const sorted = [...SESSIONS].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  const rows = filter === 'all' ? sorted : sorted.filter((s) => s.status === filter);

  const timedOut  = SESSIONS.filter((s) => s.status === 'timed-out').length;
  const completed = SESSIONS.filter((s) => s.status === 'completed').length;

  return (
    <div className="p-6">
      {/* Stats + filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-3 text-xs">
          <span className="bg-gray-800 rounded-full px-3 py-1 text-gray-400">
            <span className="text-white font-semibold">{SESSIONS.length}</span> total
          </span>
          <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400">
            <span className="font-semibold">{completed}</span> completed
          </span>
          <span className="bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 text-yellow-300">
            <span className="font-semibold">{timedOut}</span> timed out
          </span>
        </div>
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1 text-xs">
          {(['all', 'completed', 'timed-out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-3 py-1 rounded-md capitalize transition-colors',
                filter === f
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              {f === 'timed-out' ? 'Timed Out' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-widest text-gray-500 bg-gray-900/80">
              <th className="text-left px-4 py-3 font-medium">Sister</th>
              <th className="text-left px-4 py-3 font-medium">Time</th>
              <th className="text-left px-4 py-3 font-medium">Duration</th>
              <th className="text-left px-4 py-3 font-medium w-64">What They Did</th>
              <th className="text-left px-4 py-3 font-medium">Tools Used</th>
              <th className="text-left px-4 py-3 font-medium">Trigger</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((session, i) => {
              const isTimedOut = session.status === 'timed-out';
              return (
                <tr
                  key={session.id}
                  className={[
                    'border-t border-gray-800 transition-colors',
                    isTimedOut
                      ? 'bg-yellow-500/5 hover:bg-yellow-500/10'
                      : i % 2 === 0
                        ? 'bg-transparent hover:bg-gray-800/40'
                        : 'bg-gray-900/30 hover:bg-gray-800/40',
                  ].join(' ')}
                >
                  {/* Sister */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-semibold ${SISTER_COLOR[session.sister]}`}>
                      {session.sister}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-400 font-mono text-xs">
                    {formatTime(session.time)}
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`font-mono text-xs ${isTimedOut ? 'text-yellow-300' : 'text-gray-300'}`}>
                      {formatDuration(session.durationSec)}
                    </span>
                  </td>

                  {/* What they did */}
                  <td className="px-4 py-3 text-gray-300 text-xs leading-relaxed max-w-xs">
                    {session.whatTheyDid}
                  </td>

                  {/* Tools */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {session.toolsUsed.map((tool) => (
                        <span
                          key={tool}
                          className="text-xs bg-gray-800 text-gray-400 rounded px-1.5 py-0.5 font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Trigger */}
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {session.trigger}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[session.status]}`}>
                      {isTimedOut && <span className="mr-1">⚠️</span>}
                      {STATUS_LABEL[session.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-center text-gray-600 py-12 text-sm">No sessions match this filter.</p>
        )}
      </div>
    </div>
  );
}
