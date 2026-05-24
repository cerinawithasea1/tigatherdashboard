import { useApi } from './use-api';
import { HealthBar } from './health-bar';
import type { AgentStatus } from './agent-card';

interface SystemHealth {
  cpu: number;
  memory: { used: number; total: number; percent: number };
  disk: number;
  uptime: string;
  hostname: string;
  loadAvg: string;
}

interface SisterStatus {
  name: string;
  service: string | null;
  model: string;
  role: string;
  emoji: string;
  status: string;
  uptime: string;
}

const SISTER_COLORS: Record<string, string> = {
  Wisp: '#a855f7',
  Sage: '#22c55e',
  River: '#3b82f6',
  Cerina: '#ec4899',
};

function SisterCard({ sister }: { sister: SisterStatus }) {
  const borderColor = SISTER_COLORS[sister.name] || '#666';
  const isOnline = sister.status === 'online' || sister.status === 'always';
  const statusDot = isOnline ? 'bg-green-500' : 'bg-gray-500';

  return (
    <div
      className="rounded-xl border bg-gray-900/50 p-4 transition-colors hover:bg-gray-900"
      style={{ borderColor: borderColor + '40' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${statusDot}`} />
        <span className="text-lg">{sister.emoji}</span>
        <span className="text-sm font-semibold text-white">{sister.name}</span>
      </div>
      <div className="text-xs text-gray-400 mb-1">{sister.role}</div>
      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
        <span>{sister.model}</span>
        {sister.service && (
          <>
            <span>·</span>
            <span>{sister.service}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function HomeTab() {
  const { data: health } = useApi<SystemHealth>('/api/health', {
    cpu: 0, memory: { used: 0, total: 0, percent: 0 }, disk: 0, uptime: '...', hostname: '...', loadAvg: '...'
  }, 10000);

  const { data: sisters } = useApi<SisterStatus[]>('/api/sisters', [], 15000);

  return (
    <div className="p-6 space-y-6">
      {/* System Health */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          System Health
        </h2>
        <div className="flex gap-4 flex-wrap">
          <HealthBar label="CPU" value={health.cpu} />
          <HealthBar label="RAM" value={health.memory.percent} />
          <HealthBar label="Disk" value={health.disk} />
        </div>
        <div className="flex gap-4 mt-2 text-[10px] text-gray-600 font-mono">
          <span>{health.hostname}</span>
          <span>·</span>
          <span>{health.uptime}</span>
          <span>·</span>
          <span>Load: {health.loadAvg}</span>
          <span>·</span>
          <span>RAM: {health.memory.used}MB / {health.memory.total}MB</span>
        </div>
      </section>

      {/* AI Sisters */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          AI Sisters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sisters.map((sister) => (
            <SisterCard key={sister.name} sister={sister} />
          ))}
        </div>
      </section>
    </div>
  );
}
