export type TaskStatus = 'done' | 'in-progress' | 'blocked';

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  lastUpdated: string; // ISO date string
  description: string;
  sister: 'Sage' | 'River' | 'Wisp';
}

// Reference date for "days without progress" calculation: 2026-05-24
const TODAY = '2026-05-24';

export const TASK_COLUMNS: { sister: Task['sister']; color: string; borderColor: string }[] = [
  { sister: 'Sage',  color: 'text-green-400',  borderColor: 'border-green-500' },
  { sister: 'River', color: 'text-blue-400',   borderColor: 'border-blue-500'  },
  { sister: 'Wisp',  color: 'text-purple-400', borderColor: 'border-purple-500' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', sister: 'Sage',  name: 'Refactor auth module',      status: 'in-progress', lastUpdated: '2026-05-23', description: 'Clean up JWT handling, consolidate middleware, add refresh-token rotation.' },
  { id: 't2', sister: 'Sage',  name: 'Write unit tests for API',   status: 'done',        lastUpdated: '2026-05-22', description: 'Cover all endpoints with Jest; aim for 90%+ line coverage.' },
  { id: 't3', sister: 'Sage',  name: 'Deploy staging environment', status: 'blocked',     lastUpdated: '2026-05-19', description: 'Blocked on infra team approval for new VPC subnet.' },
  { id: 't4', sister: 'River', name: 'Design system audit',        status: 'in-progress', lastUpdated: '2026-05-24', description: 'Audit all components against the new Figma tokens.' },
  { id: 't5', sister: 'River', name: 'Migrate DB to Postgres 16',  status: 'done',        lastUpdated: '2026-05-20', description: 'Upgrade and validate with full regression suite.' },
  { id: 't6', sister: 'River', name: 'Set up monitoring alerts',   status: 'blocked',     lastUpdated: '2026-05-18', description: 'Waiting on Grafana Cloud credentials from DevOps.' },
  { id: 't7', sister: 'Wisp',  name: 'Build recommendation engine',status: 'in-progress', lastUpdated: '2026-05-21', description: 'Collaborative filtering prototype; needs dataset normalisation.' },
  { id: 't8', sister: 'Wisp',  name: 'Integrate payment gateway',  status: 'blocked',     lastUpdated: '2026-05-14', description: 'Stripe keys still pending merchant-of-record approval.' },
  { id: 't9', sister: 'Wisp',  name: 'Document REST endpoints',    status: 'done',        lastUpdated: '2026-05-22', description: 'OpenAPI 3.1 spec generated and published to dev portal.' },
];

export function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now  = new Date(TODAY).getTime();
  return Math.floor((now - then) / 86_400_000);
}
