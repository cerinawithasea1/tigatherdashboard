export type TaskStatus = 'done' | 'in-progress' | 'blocked' | 'pending';

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  lastUpdated: string;
  description: string;
  sister: 'Sage' | 'River' | 'Wisp';
}

export const TASK_COLUMNS: { sister: Task['sister']; color: string; borderColor: string }[] = [
  { sister: 'Sage',  color: 'text-green-400',  borderColor: 'border-green-500' },
  { sister: 'River', color: 'text-blue-400',   borderColor: 'border-blue-500'  },
  { sister: 'Wisp',  color: 'text-purple-400', borderColor: 'border-purple-500' },
];

// Empty initial — real tasks come from the API
export const INITIAL_TASKS: Task[] = [];

export function daysSince(dateStr: string): number {
  if (!dateStr) return 0;
  const then = new Date(dateStr).getTime();
  const now  = Date.now();
  return Math.floor((now - then) / 86_400_000);
}
