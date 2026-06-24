import { Circle, CheckCircle2, Dot, Trash2 } from 'lucide-react';
import { Task } from '../types/Task';

interface Props {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const config = {
  todo: { label: 'To Do', color: 'text-slate-400 light:text-slate-500', icon: Circle },
  'in-progress': { label: 'In Progress', color: 'text-blue-400 light:text-blue-600', icon: Dot },
  completed: { label: 'Completed', color: 'text-emerald-400 light:text-emerald-600', icon: CheckCircle2 },
};

export default function TaskItem({ task, onDelete, onToggle }: Props) {
  const s = config[task.status];
  const Icon = s.icon;

  return (
    <div
      className={`task-row ${
        task.status === 'completed'
          ? 'task-status-completed'
          : task.status === 'in-progress'
          ? 'task-status-inprogress'
          : 'task-status-todo'
      }`}
    >
      <button onClick={() => onToggle(task.id)} className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${s.color}`} />
      </button>

      <span
        className={`flex-1 text-sm font-medium ${
          task.status === 'completed'
            ? 'line-through text-slate-500 light:text-slate-400'
            : 'text-slate-100 light:text-slate-900'
        }`}
      >
        {task.title}
      </span>

      <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700">
        {s.label}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="text-slate-500 hover:text-red-500 light:text-slate-400 light:hover:text-red-600 p-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}