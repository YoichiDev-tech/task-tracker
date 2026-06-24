import TaskItem from "./TaskItem";
import { Task } from "../types/Task";

interface Props {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TaskList({ tasks, onDelete, onToggle }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No tasks in this category
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}