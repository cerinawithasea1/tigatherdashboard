'use client';

import { useState } from 'react';
import { useApi } from './use-api';
import { TaskCard } from './task-card';
import { TaskDetailDialog } from './task-detail-dialog';
import { TASK_COLUMNS } from './tasks-data';
import type { Task, TaskStatus } from './tasks-data';

interface TaskResponse {
  [sister: string]: { text: string; done: boolean; status: string }[];
}

function parseTasksFromApi(data: TaskResponse): Task[] {
  const tasks: Task[] = [];
  let id = 0;

  for (const [sister, items] of Object.entries(data)) {
    if (!['Wisp', 'Sage', 'River'].includes(sister)) continue;
    for (const item of items) {
      id++;
      tasks.push({
        id: `api-${id}`,
        name: item.text.replace(/\*\*/g, '').substring(0, 120),
        status: item.done ? 'done' : 'in-progress',
        lastUpdated: '2026-05-24',
        description: item.text,
        sister: sister as Task['sister'],
      });
    }
  }

  return tasks;
}

export function TasksTab() {
  const { data: apiData, loading } = useApi<TaskResponse>('/api/tasks', {});
  const [selected, setSelected] = useState<Task | null>(null);

  const tasks = parseTasksFromApi(apiData);

  function handleStatusChange(taskId: string, status: TaskStatus) {
    // In a future version, this could write back to the API
    setSelected((prev) => (prev && prev.id === taskId ? { ...prev, status } : prev));
  }

  return (
    <div className="p-6">
      {loading && (
        <div className="text-xs text-gray-500 font-mono mb-4">Loading tasks from sanctuary...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TASK_COLUMNS.map(({ sister, color, borderColor }) => {
          const col = tasks.filter((t) => t.sister === sister);
          const pending = col.filter(t => t.status !== 'done').length;
          const done = col.filter(t => t.status === 'done').length;
          return (
            <div key={sister} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 border-b pb-2 ${borderColor}`}>
                <h2 className={`text-sm font-semibold uppercase tracking-widest ${color}`}>
                  {sister}
                </h2>
                <span className="ml-auto text-xs text-gray-600 bg-gray-800 rounded-full px-2 py-0.5">
                  {pending} active · {done} done
                </span>
              </div>

              {/* Task cards */}
              {col.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-6">No tasks found</p>
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
