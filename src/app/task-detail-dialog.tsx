'use client';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { Task, TaskStatus } from './tasks-data';
import { daysSince } from './tasks-data';

const STATUS_LABEL: Record<TaskStatus, string> = {
  done: 'Done',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
};

const STATUS_DOT: Record<TaskStatus, string> = {
  done:          'bg-green-400',
  'in-progress': 'bg-yellow-400',
  blocked:       'bg-red-400',
};

interface TaskDetailDialogProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskDetailDialog({ task, onClose, onStatusChange }: TaskDetailDialogProps) {
  if (!task) return null;
  const days = daysSince(task.lastUpdated);
  const isStale = days >= 3;

  return (
    <Dialog open={!!task} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-base">
            {isStale && <span className="mr-1">👻</span>}
            {task.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-xs">
            Assigned to <span className="font-medium text-gray-300">{task.sister}</span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-gray-300 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-2 gap-3 text-xs mt-1">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-500 mb-1">Last Updated</p>
            <p className="text-gray-200 font-medium">{task.lastUpdated}</p>
          </div>
          <div className={`bg-gray-800 rounded-lg p-3 ${isStale ? 'ring-1 ring-orange-500/40' : ''}`}>
            <p className="text-gray-500 mb-1">Days Idle</p>
            <p className={`font-medium ${isStale ? 'text-orange-400' : 'text-gray-200'}`}>
              {days} day{days !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="mt-1">
          <p className="text-xs text-gray-500 mb-2">Status</p>
          <Select
            value={task.status}
            onValueChange={(val) => onStatusChange(task.id, val as TaskStatus)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 h-9 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[task.status]}`} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
              {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                <SelectItem key={s} value={s} className="focus:bg-gray-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
                    {STATUS_LABEL[s]}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
