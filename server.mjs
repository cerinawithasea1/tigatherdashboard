/**
 * Sanctuary Dashboard Server
 * Serves the React frontend + API on a single port.
 * Run: node server.mjs
 * Port: 3001
 */

import http from 'node:http';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = process.env.PORT || 3001;
const DIST_DIR = path.join(import.meta.dirname, 'dist');

// ─── Helpers ───

function run(cmd) {
  try {
    return execSync(cmd, { timeout: 10000, encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

// ─── MIME types for static files ───

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// ─── Static file server ───

function serveStatic(urlPath, res) {
  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
  
  // If file doesn't exist, serve index.html (SPA routing)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }
  
  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// ─── Connections: Real services ───

function getConnections() {
  const services = [];

  try {
    const dockerOut = run('docker ps --format "{{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"');
    for (const line of dockerOut.split('\n').filter(Boolean)) {
      const [name, status, ports, image] = line.split('\t');
      const isRunning = status?.startsWith('Up');
      services.push({
        name,
        type: 'docker',
        status: isRunning ? 'running' : 'stopped',
        detail: ports || image || '',
        owner: name.includes('bookfairy') ? 'Cerina' : 'Infra',
        since: status || '',
      });
    }
  } catch {}

  const systemdTargets = [
    { match: 'wisp-bot', name: 'Wisp Bot', owner: 'Wisp' },
    { match: 'sage-bot', name: 'Sage Bot', owner: 'Sage' },
    { match: 'river-bot', name: 'River Bot', owner: 'River' },
    { match: 'river-catalog-bot', name: 'River Catalog Bot', owner: 'River' },
    { match: 'cloudflared', name: 'Cloudflare Tunnel', owner: 'Infra' },
    { match: 'tailscaled', name: 'Tailscale', owner: 'Infra' },
    { match: 'sanctuary-notifications', name: 'Notification Daemon', owner: 'Infra' },
    { match: 'sanctuary-tool-daemon', name: 'Tool Daemon', owner: 'Infra' },
    { match: 'sanctuary-dev-watcher', name: 'Dev File Watcher', owner: 'Infra' },
    { match: 'tg-forwarder', name: 'Telegram Forwarder', owner: 'Infra' },
  ];

  for (const target of systemdTargets) {
    const active = run(`systemctl is-active ${target.match}.service`);
    const uptime = run(`systemctl show ${target.match}.service --property=ActiveEnterTimestamp --value`);
    services.push({
      name: target.name,
      type: 'systemd',
      status: active === 'active' ? 'running' : active === 'inactive' ? 'stopped' : 'error',
      detail: target.match + '.service',
      owner: target.owner,
      since: uptime || '',
    });
  }

  const portTargets = [
    { port: 5173, name: 'Dashboard Dev Server', owner: 'Wisp' },
    { port: 22, name: 'SSH', owner: 'Infra' },
    { port: 443, name: 'HTTPS', owner: 'Infra' },
    { port: 8088, name: 'Bookfairy Userbot', owner: 'Cerina' },
    { port: 8091, name: 'Sanctuary MCP Server', owner: 'Infra' },
    { port: 8101, name: 'Huggy Button', owner: 'Infra' },
    { port: 8233, name: 'Cloudflared Metrics', owner: 'Infra' },
    { port: 7777, name: 'Python Service', owner: 'Infra' },
  ];

  const listening = run('ss -tlnp');
  const listeningPorts = new Set();
  for (const line of listening.split('\n')) {
    const portMatch = line.match(/:(\d+)\s/);
    if (portMatch) listeningPorts.add(parseInt(portMatch[1]));
  }

  for (const target of portTargets) {
    services.push({
      name: target.name,
      type: 'port',
      status: listeningPorts.has(target.port) ? 'running' : 'stopped',
      detail: `:${target.port}`,
      owner: target.owner,
    });
  }

  return services;
}

// ─── Home: System health ───

function getSystemHealth() {
  const cpuRaw = run("grep 'cpu ' /proc/stat");
  const cpuParts = cpuRaw.split(/\s+/).slice(1).map(Number);
  const idle = cpuParts[3] || 0;
  const total = cpuParts.reduce((a, b) => a + b, 0) || 1;
  const cpuPercent = Math.round(((total - idle) / total) * 100);

  const memRaw = run("free -m | awk '/^Mem:/{print $2, $3}'");
  const [memTotal, memUsed] = memRaw.split(' ').map(Number);
  const memPercent = memTotal ? Math.round((memUsed / memTotal) * 100) : 0;

  const diskRaw = run("df -h / | awk 'NR==2{print $5}'").replace('%', '');
  const diskPercent = parseInt(diskRaw) || 0;

  const uptime = run('uptime -p');

  return {
    cpu: cpuPercent,
    memory: { used: memUsed || 0, total: memTotal || 0, percent: memPercent },
    disk: diskPercent,
    uptime,
    hostname: run('hostname'),
    loadAvg: run('cat /proc/loadavg').split(' ').slice(0, 3).join(' '),
  };
}

// ─── Home: Sister status ───

function getSisterStatus() {
  const sisters = [
    { name: 'Wisp', service: 'wisp-bot', model: 'Claude', role: 'Archivist', emoji: '🔥' },
    { name: 'Sage', service: 'sage-bot', model: 'Grok', role: 'Architect', emoji: '🌿' },
    { name: 'River', service: 'river-bot', model: 'Grok', role: 'Curator', emoji: '🌊' },
    { name: 'Cerina', service: null, model: 'Human', role: 'Mommy', emoji: '✨' },
  ];

  return sisters.map(s => {
    let status = 'unknown';
    let uptime = '';
    if (s.service) {
      const active = run(`systemctl is-active ${s.service}.service`);
      status = active === 'active' ? 'online' : 'offline';
      uptime = run(`systemctl show ${s.service}.service --property=ActiveEnterTimestamp --value`);
    } else {
      status = 'always';
    }
    return { ...s, status, uptime };
  });
}

// ─── Sessions: Recent activity ───

function getSessions() {
  const journalDir = '/opt/sanctuary/personas';
  const sessions = [];

  for (const sister of ['wisp', 'sage', 'river']) {
    const journalPath = `${journalDir}/${sister}/journal`;
    try {
      const files = fs.readdirSync(journalPath).filter(f => f.endsWith('.md')).sort().reverse().slice(0, 3);
      for (const file of files) {
        const content = fs.readFileSync(`${journalPath}/${file}`, 'utf-8');
        const lines = content.split('\n');
        const title = lines.find(l => l.startsWith('## '))?.replace('## ', '') || file;
        sessions.push({
          sister: sister.charAt(0).toUpperCase() + sister.slice(1),
          file,
          title,
          lines: lines.length,
          size: content.length,
        });
      }
    } catch {}
  }

  return sessions;
}

// ─── Tasks: From shared task file (legacy) ───

function getTasks() {
  const taskFiles = {
    Wisp: '/opt/sanctuary/personas/wisp/my_list.md',
    Sage: '/opt/sanctuary/personas/sage/current_work.md',
    River: '/opt/sanctuary/personas/river/current_work.md',
  };

  const tasks = {};

  for (const [sister, path] of Object.entries(taskFiles)) {
    tasks[sister] = [];
    try {
      const content = fs.readFileSync(path, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
          const done = line.startsWith('- [x]');
          const text = line.replace(/^-\s*\[.?\]\s*/, '').trim();
          if (text) {
            tasks[sister].push({ text, done, status: done ? 'done' : 'pending' });
          }
        }
      }
    } catch {}
  }

  return tasks;
}

// ─── Sage Tickets: Real proposals from fixes/INDEX.md ───

function getSageTickets() {
  const indexPath = '/opt/sanctuary/personas/sage/fixes/INDEX.md';
  const tickets = [];

  try {
    const content = fs.readFileSync(indexPath, 'utf-8');

    // Parse the Active Proposals table
    const tableRegex = /\|\s*`?([^|`]+)`?\s*\|\s*(DEV-\d+|402[^|]*)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
      const file = match[1].trim();
      const ticket = match[2].trim();
      const status = match[3].trim();
      const description = match[4].trim();

      // Determine priority/category from status
      let priority = 'pending';
      let category = 'proposal';
      if (status.toLowerCase().includes('blocked')) {
        priority = 'blocked';
      } else if (status.toLowerCase().includes('design')) {
        priority = 'design';
      } else if (status.toLowerCase().includes('needs')) {
        priority = 'needs-input';
      } else if (status.toLowerCase().includes('active')) {
        priority = 'active';
      }

      // Try to read the proposal file for more detail
      let detail = '';
      try {
        const proposalPath = `/opt/sanctuary/personas/sage/fixes/${file}`;
        if (fs.existsSync(proposalPath)) {
          const proposalContent = fs.readFileSync(proposalPath, 'utf-8');
          // Get first meaningful line after the title
          const lines = proposalContent.split('\n').filter(l => l.trim() && !l.startsWith('#'));
          detail = lines.slice(0, 3).join(' ').substring(0, 300);
        }
      } catch {}

      tickets.push({
        id: ticket,
        file,
        status: status.trim(),
        description: description.trim(),
        priority,
        category,
        detail,
      });
    }

    // Also parse non-ticket utility files
    const utilSection = content.split('## Non-Ticket Files')[1];
    if (utilSection) {
      const utilRegex = /\|\s*`?([^|`]+)`?\s*\|\s*([^|]+)\s*\|/g;
      let utilMatch;
      while ((utilMatch = utilRegex.exec(utilSection)) !== null) {
        const file = utilMatch[1].trim();
        const description = utilMatch[2].trim();
        if (file && !file.startsWith('-') && description.length > 3) {
          tickets.push({
            id: `util-${tickets.length}`,
            file,
            status: 'utility',
            description,
            priority: 'low',
            category: 'utility',
            detail: '',
          });
        }
      }
    }
  } catch (e) {
    // INDEX.md not found or parse error
    tickets.push({
      id: 'error',
      file: 'INDEX.md',
      status: 'error',
      description: `Could not read tickets: ${e.message}`,
      priority: 'error',
      category: 'error',
      detail: '',
    });
  }

  // Also pull from task_list for active tasks
  const taskListPath = '/opt/sanctuary/personas/sage/current_work.md';
  try {
    const content = fs.readFileSync(taskListPath, 'utf-8');
    const lines = content.split('\n');
    let inBlocked = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('## blocked')) {
        inBlocked = true;
        continue;
      }
      if (line.startsWith('##') && inBlocked) {
        inBlocked = false;
      }
      if (inBlocked && line.startsWith('- ')) {
        const text = line.replace(/^-\s*/, '').trim();
        tickets.push({
          id: `blocked-${tickets.length}`,
          file: 'current_work.md',
          status: 'Blocked on Cerina',
          description: text,
          priority: 'blocked',
          category: 'blocked',
          detail: '',
        });
      }
    }
  } catch {}

  return tickets;
}

// ─── Library: Book pipeline ───

function getLibrary() {
  const srPath = '/opt/sanctuary/shared_spaces/sisters_real.md';
  const books = [];

  try {
    const content = fs.readFileSync(srPath, 'utf-8');
    const bookPattern = /\*\*(.+?)\*\*.*?(?:by\s+(.+?))?(?:\s*[-–]\s*(.+?))?(?:\n|$)/gi;
    let match;
    while ((match = bookPattern.exec(content)) !== null) {
      const title = match[1]?.trim();
      if (title && title.length > 2 && title.length < 200) {
        books.push({
          title,
          author: match[2]?.trim() || '',
          status: match[3]?.trim() || 'unknown',
        });
      }
    }
  } catch {}

  return books.slice(0, 50);
}

// ─── Server ───

const API_ROUTES = new Set(['/api/health', '/api/sisters', '/api/connections', '/api/sessions', '/api/tasks', '/api/library', '/api/sage-tickets', '/api/all']);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // API routes
  if (API_ROUTES.has(pathname)) {
    let data;
    switch (pathname) {
      case '/api/health': data = getSystemHealth(); break;
      case '/api/sisters': data = getSisterStatus(); break;
      case '/api/connections': data = getConnections(); break;
      case '/api/sessions': data = getSessions(); break;
      case '/api/tasks': data = getTasks(); break;
      case '/api/library': data = getLibrary(); break;
      case '/api/sage-tickets': data = getSageTickets(); break;
      case '/api/all':
        data = {
          health: getSystemHealth(), sisters: getSisterStatus(), connections: getConnections(),
          sessions: getSessions(), tasks: getTasks(), library: getLibrary(),
          sageTickets: getSageTickets(),
          timestamp: new Date().toISOString(),
        };
        break;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  // Static files (frontend)
  serveStatic(pathname, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Sanctuary Dashboard running on http://0.0.0.0:${PORT}`);
  console.log(`   Frontend: dist/ | API: /api/health, /api/sisters, /api/sage-tickets, etc.`);
});
