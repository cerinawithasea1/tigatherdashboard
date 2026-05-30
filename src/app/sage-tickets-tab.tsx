'use client';

import { useState } from 'react';
import { useApi } from './use-api';
import { PRIORITY_STYLES } from './sage-tickets-data';
import type { SageTicket, TicketPriority } from './sage-tickets-data';

export function SageTicketsTab() {
  const { data: tickets, loading } = useApi<SageTicket[]>('/api/sage-tickets', [], 30000);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<TicketPriority | 'all'>('all');

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.priority === filter);

  // Group by category
  const proposals = filtered.filter(t => t.category === 'proposal');
  const utilities = filtered.filter(t => t.category === 'utility');
  const blocked = filtered.filter(t => t.category === 'blocked');

  // Stats
  const totalProposals = tickets.filter(t => t.category === 'proposal').length;
  const totalBlocked = tickets.filter(t => t.priority === 'blocked').length;
  const totalNeedsInput = tickets.filter(t => t.priority === 'needs-input').length;
  const totalDesign = tickets.filter(t => t.priority === 'design').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-green-400">🌿</span> Sage's Dev Tickets
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Proposals, fixes, and active work — {totalProposals} total
          </p>
        </div>
        {loading && (
          <span className="text-xs text-gray-600 font-mono animate-pulse">syncing...</span>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 flex-wrap">
        <StatPill label="Total" count={totalProposals} color="text-gray-300" />
        <StatPill label="Blocked" count={totalBlocked} color="text-red-400" />
        <StatPill label="Needs Input" count={totalNeedsInput} color="text-amber-400" />
        <StatPill label="Design" count={totalDesign} color="text-blue-400" />
        <StatPill label="Utilities" count={utilities.length} color="text-purple-400" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'blocked', 'needs-input', 'design', 'pending', 'utility'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === f
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-gray-700 text-gray-500 hover:text-gray-300'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Proposals section */}
      {proposals.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Proposals & Tickets
          </h3>
          <div className="space-y-2">
            {proposals.map(ticket => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                expanded={expanded === ticket.id}
                onToggle={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Blocked section */}
      {blocked.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-red-500/60 mb-3">
            Blocked on Cerina
          </h3>
          <div className="space-y-2">
            {blocked.map(ticket => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                expanded={expanded === ticket.id}
                onToggle={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Utilities section */}
      {utilities.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-purple-500/60 mb-3">
            Utility Files
          </h3>
          <div className="space-y-2">
            {utilities.map(ticket => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                expanded={expanded === ticket.id}
                onToggle={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-600 text-sm">
          No tickets match this filter.
        </div>
      )}
    </div>
  );
}

function StatPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-center min-w-[60px]">
      <div className={`text-lg font-bold ${color}`}>{count}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function TicketRow({ ticket, expanded, onToggle }: { ticket: SageTicket; expanded: boolean; onToggle: () => void }) {
  const style = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.pending;

  return (
    <div className={`border rounded-xl transition-colors ${style.border} bg-gray-900/50`}>
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        {/* Priority indicator */}
        <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
          ticket.priority === 'blocked' ? 'bg-red-400' :
          ticket.priority === 'needs-input' ? 'bg-amber-400' :
          ticket.priority === 'design' ? 'bg-blue-400' :
          ticket.priority === 'active' ? 'bg-green-400' :
          'bg-gray-600'
        }`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
              {style.label}
            </span>
          </div>
          <p className="text-sm text-white leading-snug">{ticket.description}</p>
          <p className="text-[10px] text-gray-600 mt-1 font-mono">{ticket.file}</p>
        </div>

        <span className="text-gray-600 text-xs shrink-0">{expanded ? '▾' : '▸'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && ticket.detail && (
        <div className="px-4 pb-4 pt-0 ml-5">
          <div className="bg-gray-950 rounded-lg p-3 text-xs text-gray-400 leading-relaxed border border-gray-800">
            {ticket.detail}
          </div>
        </div>
      )}
    </div>
  );
}
