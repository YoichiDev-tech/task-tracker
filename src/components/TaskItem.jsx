export default function TaskItem({ task, onDelete, onToggle }) {
  return (
    <div className="task-item">
      <span>{task.title}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>

      <button onClick={() => onToggle(task.id)}>Toggle</button>
    </div>
  );
}