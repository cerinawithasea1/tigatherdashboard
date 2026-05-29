export type AgentStatus = 'online' | 'offline' | 'idle';

export interface Agent {
  name: string;
  borderColor: string;
  status: AgentStatus;
  model: string;
  role: string;
  service: string;
}

const STATUS_COLORS: Record<AgentStatus, string> = {
  online:  'bg-green-500',
  offline: 'bg-gray-500',
  idle:    'bg-yellow-500',
};

const AGENTS: Agent[] = [
  { name: 'Wisp',   borderColor: '#a855f7', status: 'online',  model: 'Mimo',  role: 'Archivist & Memory Keeper', service: 'wisp-bot.service' },
  { name: 'Sage',   borderColor: '#22c55e', status: 'online',  model: 'Mimo',  role: 'Dev Lead & Architect',      service: 'sage-bot.service' },
  { name: 'River',  borderColor: '#3b82f6', status: 'online',  model: 'Mimo',  role: 'Librarian & Cataloger',     service: 'river-bot.service' },
  { name: 'Cerina', borderColor: '#ec4899', status: 'online',  model: '—',     role: 'Mommy',                      service: '@cerinawithasea' },
];

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div
      className="rounded-xl border bg-gray-900/50 p-4 transition-colors hover:bg-gray-900"
      style={{ borderColor: agent.borderColor + '40' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[agent.status]}`} />
        <span className="text-sm font-semibold text-white">{agent.name}</span>
      </div>
      <div className="text-xs text-gray-400 mb-1">{agent.role}</div>
      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
        <span>{agent.model}</span>
        <span>·</span>
        <span>{agent.service}</span>
      </div>
    </div>
  );
}

export { AgentCard, AGENTS };
