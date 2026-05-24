import type { Task, TaskStatus } from './tasks-data';
import { daysSince } from './tasks-data';

const STATUS_STYLES: Record<TaskStatus, string> = {
  done:        'bg-green-500/20 text-green-400 border border-green-500/30',
  'in-progress':'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  blocked:     'bg-red-500/20 text-red-400 border border-red-500/30',
  pending:     'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  done: 'Done',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  pending: 'Pending',
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const days = daysSince(task.lastUpdated);
  const isStale = days >= 3;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-white group-hover:text-gray-100 leading-snug">
          {isStale && <span className="mr-1">👻</span>}
          {task.name}
        </span>
      </div>
      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${STATUS_STYLES[task.status]}`}>
        {STATUS_LABEL[task.status]}
      </span>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Updated {task.lastUpdated}</span>
        <span className={isStale ? 'text-orange-400 font-medium' : ''}>
          {days}d idle
        </span>
      </div>
    </button>
  );
}
