'use client';

import { useState } from 'react';
import { TaskCard } from './task-card';
import { TaskDetailDialog } from './task-detail-dialog';
import { INITIAL_TASKS, TASK_COLUMNS } from './tasks-data';
import type { Task, TaskStatus } from './tasks-data';

export function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selected, setSelected] = useState<Task | null>(null);

  function handleStatusChange(taskId: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status, lastUpdated: new Date().toISOString().slice(0, 10) } : t))
    );
    setSelected((prev) => (prev && prev.id === taskId ? { ...prev, status } : prev));
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TASK_COLUMNS.map(({ sister, color, borderColor }) => {
          const col = tasks.filter((t) => t.sister === sister);
          return (
            <div key={sister} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 border-b pb-2 ${borderColor}`}>
                <h2 className={`text-sm font-semibold uppercase tracking-widest ${color}`}>
                  {sister}
                </h2>
                <span className="ml-auto text-xs text-gray-600 bg-gray-800 rounded-full px-2 py-0.5">
                  {col.length}
                </span>
              </div>

              {/* Task cards */}
              {col.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-6">No tasks</p>
              ) : (
                col.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelected(task)} />
                ))
              )}
            </div>
          );
        })}
      </div>

      <TaskDetailDialog
        task={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
