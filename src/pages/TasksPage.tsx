import { useContext } from 'react';
import { ListTodo, Plus } from 'lucide-react';
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';
import { AppContext } from '../App';

const taskExamples = [
  'Review project requirements',
  'Complete project milestone',
  'Organize workspace',
];

export default function TasksPage() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { tasks, handleAddTask, handleDeleteTask, handleToggleTask } = context;

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <ListTodo className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-title-md text-slate-900 dark:text-white">Task Management</h1>
        </div>
        <p className="text-subtitle">Create, organize, and track your tasks efficiently</p>
      </div>

      {/* Add Task Section */}
      <div className="card-elevated mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-title-sm text-slate-900 dark:text-white">Create New Task</h2>
            <p className="text-subtitle mt-2">Add a task to your list or choose from suggestions</p>
          </div>
          <Plus className="h-8 w-8 text-blue-500 opacity-20" />
        </div>

        <div className="space-y-4">
          <AddTaskForm onAdd={handleAddTask} />
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Suggested tasks:</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {taskExamples.map((example) => (
                <button
                  key={example}
                  onClick={() => handleAddTask(example)}
                  className="btn-secondary text-left justify-start"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card-base">
        <div className="mb-6">
          <h2 className="text-title-sm text-slate-900 dark:text-white">Your Tasks</h2>
          <p className="text-subtitle mt-2">Total: {tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <div>
          <TaskList tasks={tasks} onDelete={handleDeleteTask} onToggle={handleToggleTask} />
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No tasks yet. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
