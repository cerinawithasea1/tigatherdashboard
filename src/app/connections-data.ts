export type ServiceStatus = 'running' | 'stopped' | 'error' | 'unknown';

export interface Service {
  name: string;
  type: 'docker' | 'systemd' | 'port' | 'tunnel';
  status: ServiceStatus;
  detail: string;       // e.g. "Up 4 hours", "port 8088→8080"
  owner?: string;       // which sister or Cerina owns it
  since?: string;       // when it started
}

// Real data — pulled from `docker ps`, `systemctl`, `ss -tlnp` on May 24 2026

export const SERVICES: Service[] = [
  // Docker containers
  { name: 'Bookfairy Userbot',        type: 'docker',  status: 'running', detail: 'Port 8088→8080',            owner: 'Cerina', since: '~4h ago' },

  // Systemd services — Sisters
  { name: 'Wisp Bot',                 type: 'systemd', status: 'running', detail: 'wisp-bot.service',          owner: 'Wisp'   },
  { name: 'Sage Bot',                 type: 'systemd', status: 'running', detail: 'sage-bot.service',          owner: 'Sage'   },
  { name: 'River Bot',                type: 'systemd', status: 'running', detail: 'river-bot.service',         owner: 'River'  },
  { name: 'River Catalog Bot',        type: 'systemd', status: 'running', detail: 'river-catalog-bot.service', owner: 'River'  },

  // Systemd services — Infrastructure
  { name: 'Cloudflare Tunnel',        type: 'tunnel',  status: 'running', detail: 'cloudflared.service',       owner: 'Infra'  },
  { name: 'Tailscale',                type: 'systemd', status: 'running', detail: 'tailscaled.service',        owner: 'Infra'  },
  { name: 'Notification Daemon',      type: 'systemd', status: 'running', detail: 'sanctuary-notifications',   owner: 'Infra'  },
  { name: 'Tool Daemon',              type: 'systemd', status: 'running', detail: 'sanctuary-tool-daemon',     owner: 'Infra'  },
  { name: 'Dev File Watcher',         type: 'systemd', status: 'running', detail: 'sanctuary-dev-watcher',     owner: 'Infra'  },
  { name: 'Telegram Forwarder',       type: 'systemd', status: 'running', detail: 'tg-forwarder-adam',         owner: 'Infra'  },

  // Listening ports — notable
  { name: 'Dashboard Dev Server',     type: 'port',    status: 'running', detail: ':5173 (Vite)',              owner: 'Wisp'   },
  { name: 'SSH',                      type: 'port',    status: 'running', detail: ':22',                       owner: 'Infra'  },
  { name: 'HTTPS',                    type: 'port',    status: 'running', detail: ':443',                      owner: 'Infra'  },
];

export const SERVICE_COLORS: Record<Service['type'], string> = {
  docker:  'text-orange-400',
  systemd: 'text-indigo-400',
  port:    'text-gray-400',
  tunnel:  'text-cyan-400',
};

export const STATUS_COLORS: Record<ServiceStatus, string> = {
  running: 'bg-green-500',
  stopped: 'bg-gray-500',
  error:   'bg-red-500',
  unknown: 'bg-yellow-500',
};

export const TYPE_ICONS: Record<Service['type'], string> = {
  docker:  '🐳',
  systemd: '⚙️',
  port:    '🔌',
  tunnel:  '🌐',
};
