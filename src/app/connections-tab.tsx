import { SERVICES, SERVICE_COLORS, STATUS_COLORS, TYPE_ICONS } from './connections-data';
import type { Service, ServiceStatus } from './connections-data';

function StatusDot({ status }: { status: ServiceStatus }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[status]} shrink-0`} />
  );
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors">
      <span className="text-lg">{TYPE_ICONS[service.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-100 truncate">{service.name}</span>
          {service.owner && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
              {service.owner}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 font-mono truncate">{service.detail}</div>
      </div>
      <StatusDot status={service.status} />
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-5 pb-2">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</h3>
      <span className="text-[10px] text-gray-600 font-mono">{count}</span>
    </div>
  );
}

export function ConnectionsTab() {
  const docker = SERVICES.filter((s) => s.type === 'docker');
  const systemd = SERVICES.filter((s) => s.type === 'systemd');
  const tunnels = SERVICES.filter((s) => s.type === 'tunnel');
  const ports = SERVICES.filter((s) => s.type === 'port');
  const running = SERVICES.filter((s) => s.status === 'running').length;
  const total = SERVICES.length;

  return (
    <div className="p-6">
      {/* Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{running}</span>
          <span className="text-sm text-gray-500">/ {total} services running</span>
        </div>
        {running === total && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800/30 font-mono">
            ALL CLEAR
          </span>
        )}
        {running < total && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800/30 font-mono">
            {total - running} DOWN
          </span>
        )}
      </div>

      {/* Service list */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
        {tunnels.length > 0 && (
          <>
            <SectionHeader label="Tunnels" count={tunnels.length} />
            {tunnels.map((s) => <ServiceRow key={s.name} service={s} />)}
          </>
        )}
        {systemd.length > 0 && (
          <>
            <SectionHeader label="System Services" count={systemd.length} />
            {systemd.map((s) => <ServiceRow key={s.name} service={s} />)}
          </>
        )}
        {docker.length > 0 && (
          <>
            <SectionHeader label="Docker" count={docker.length} />
            {docker.map((s) => <ServiceRow key={s.name} service={s} />)}
          </>
        )}
        {ports.length > 0 && (
          <>
            <SectionHeader label="Listening Ports" count={ports.length} />
            {ports.map((s) => <ServiceRow key={s.name} service={s} />)}
          </>
        )}
      </div>

      {/* Footer note */}
      <p className="text-[10px] text-gray-600 mt-4 font-mono">
        Last scanned: {new Date().toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })} — data from docker ps, systemctl, ss -tlnp
      </p>
    </div>
  );
}
