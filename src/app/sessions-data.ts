export type SessionStatus = 'completed' | 'timed-out';

export interface Session {
  id: string;
  sister: 'Sage' | 'River' | 'Wisp' | 'Cerina';
  time: string;        // ISO datetime
  durationSec: number; // seconds
  whatTheyDid: string;
  toolsUsed: string[];
  trigger: string;
  status: SessionStatus;
}

function dt(date: string, time: string) { return `${date}T${time}:00`; }

export const SESSIONS: Session[] = [
  { id:'s01', sister:'Sage',   time: dt('2026-05-24','08:11'), durationSec:  143, whatTheyDid:'Ran auth token refresh cycle, purged expired sessions from cache.',        toolsUsed:['redis-flush','jwt-rotate'],            trigger:'Scheduled cron',      status:'completed'  },
  { id:'s02', sister:'River',  time: dt('2026-05-24','07:58'), durationSec:  512, whatTheyDid:'Audited 38 UI components against new Figma token set, flagged 6 mismatches.',toolsUsed:['figma-api','diff-report'],             trigger:'Manual trigger',      status:'completed'  },
  { id:'s03', sister:'Wisp',   time: dt('2026-05-24','07:44'), durationSec: 3600, whatTheyDid:'Attempted payment gateway handshake — merchant credentials missing, loop stalled.',toolsUsed:['stripe-api','vault-read'],       trigger:'Webhook: new order',  status:'timed-out'  },
  { id:'s04', sister:'Cerina', time: dt('2026-05-24','07:30'), durationSec:  289, whatTheyDid:'Generated weekly digest email for 412 subscribers, queued delivery.',       toolsUsed:['template-engine','smtp-queue'],        trigger:'Scheduled cron',      status:'completed'  },
  { id:'s05', sister:'Sage',   time: dt('2026-05-24','06:55'), durationSec:  874, whatTheyDid:'Ran staging environment smoke tests, 3/3 suites green.',                    toolsUsed:['playwright','slack-notify'],           trigger:'Push: main branch',   status:'completed'  },
  { id:'s06', sister:'River',  time: dt('2026-05-23','23:15'), durationSec: 3600, whatTheyDid:'Database migration job exceeded time limit — rollback initiated.',          toolsUsed:['pg-migrate','backup-restore'],         trigger:'Scheduled cron',      status:'timed-out'  },
  { id:'s07', sister:'Wisp',   time: dt('2026-05-23','22:40'), durationSec:  201, whatTheyDid:'Normalised recommendation dataset, wrote 14k rows to staging table.',       toolsUsed:['pandas-runner','sql-write'],           trigger:'Manual trigger',      status:'completed'  },
  { id:'s08', sister:'Cerina', time: dt('2026-05-23','21:05'), durationSec:  456, whatTheyDid:'Responded to 22 support tickets using RAG pipeline, escalated 2.',         toolsUsed:['rag-query','zendesk-api'],             trigger:'Webhook: ticket queue',status:'completed' },
  { id:'s09', sister:'Sage',   time: dt('2026-05-23','18:30'), durationSec:  3600,whatTheyDid:'Dependency vulnerability scan hung waiting for package registry response.', toolsUsed:['snyk-cli','npm-audit'],               trigger:'Scheduled cron',      status:'timed-out'  },
  { id:'s10', sister:'River',  time: dt('2026-05-23','17:10'), durationSec:  338, whatTheyDid:'Rebuilt search index for 9,200 library entries.',                          toolsUsed:['elastic-reindex','progress-log'],      trigger:'Manual trigger',      status:'completed'  },
  { id:'s11', sister:'Wisp',   time: dt('2026-05-23','14:55'), durationSec:  625, whatTheyDid:'Fetched 3 new audiobook metadata records, pushed to Library pipeline.',    toolsUsed:['isbn-api','library-db-write'],         trigger:'Webhook: new upload', status:'completed'  },
  { id:'s12', sister:'Cerina', time: dt('2026-05-23','11:20'), durationSec: 3600, whatTheyDid:'Social media scheduler stalled — OAuth token expired mid-execution.',       toolsUsed:['twitter-api','oauth-refresh'],         trigger:'Scheduled cron',      status:'timed-out'  },
];

export const SISTER_COLOR: Record<Session['sister'], string> = {
  Sage:   'text-green-400',
  River:  'text-blue-400',
  Wisp:   'text-purple-400',
  Cerina: 'text-pink-400',
};

export function formatDuration(sec: number): string {
  if (sec < 60)  return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}
