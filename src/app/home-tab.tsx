import { HealthBar } from './health-bar';
import { AgentCard } from './agent-card';
import type { Agent } from './agent-card';

const HEALTH = [
  { label: 'CPU', value: 42 },
  { label: 'RAM', value: 67 },
  { label: 'Disk', value: 81 },
];

const AGENTS: Agent[] = [
  { name: 'Sage',   borderColor: '#22c55e', online: true,  model: 'GPT-4o',        uptime: '14d 3h'  },
  { name: 'River',  borderColor: '#3b82f6', online: true,  model: 'Claude 3.5',    uptime: '7d 11h'  },
  { name: 'Wisp',   borderColor: '#a855f7', online: false, model: 'Gemini 1.5',    uptime: '0d 0h'   },
  { name: 'Cerina', borderColor: '#ec4899', online: true,  model: 'Mistral-Large', uptime: '2d 8h'   },
];

export function HomeTab() {
  return (
    <div className="p-6 space-y-6">
      {/* System Health */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          System Health
        </h2>
        <div className="flex gap-4 flex-wrap">
          {HEALTH.map((h) => (
            <HealthBar key={h.label} label={h.label} value={h.value} />
          ))}
        </div>
      </section>

      {/* AI Sisters */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          AI Sisters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
}
