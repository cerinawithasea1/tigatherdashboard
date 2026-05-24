import { HealthBar } from './health-bar';
import { AgentCard } from './agent-card';
import { AGENTS } from './agent-card';

const HEALTH = [
  { label: 'CPU', value: 42 },
  { label: 'RAM', value: 67 },
  { label: 'Disk', value: 81 },
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
