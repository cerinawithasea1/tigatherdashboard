interface Agent {
  name: string;
  borderColor: string;
  online: boolean;
  model: string;
  uptime: string;
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div
      className="bg-gray-900 rounded-xl p-5 border border-gray-800"
      style={{ borderLeft: `4px solid ${agent.borderColor}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-white">{agent.name}</h3>
        <span className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${agent.online ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}
          />
          <span className={agent.online ? 'text-green-400' : 'text-gray-500'}>
            {agent.online ? 'Online' : 'Offline'}
          </span>
        </span>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Model</span>
          <span className="text-gray-200">{agent.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Uptime</span>
          <span className="text-gray-200">{agent.uptime}</span>
        </div>
      </div>
    </div>
  );
}

export type { Agent };
