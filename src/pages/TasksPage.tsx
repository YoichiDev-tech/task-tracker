import { useContext, useState } from "react";
import { AppContext } from "../App";
import LockedFeatureModal from "../components/LockedFeatureModal";

export default function TasksPage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const {
    tasks,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    isDemo,
    isFull,
  } = context;

  const [newTask, setNewTask] = useState("");
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleLocked = () => {
    setShowLockedModal(true);
  };

  const handleUnlock = () => {
    setShowLockedModal(false);
    setShowKeyModal(true);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    handleAddTask(newTask.trim());
    setNewTask("");
  };

  const taskExamples = [
    "Review project requirements",
    "Reply to pending email",
    "Organize workspace",
  ];

  return (
    <div className="p-6 pb-24">
      {/* HEADER */}
      <h1 className="text-title-md text-white light:text-slate-900">
        Task Management
      </h1>
      <p className="text-sm text-slate-400 light:text-slate-600 mb-6">
        Create, organize, and track your tasks efficiently.
      </p>

      {/* CREATE TASK CARD */}
      <div className="card-base p-4 mb-6">
        <h2 className="text-title-sm text-white light:text-slate-900">
          Create New Task
        </h2>
        <p className="text-xs text-slate-400 light:text-slate-600 mb-3">
          Add a task to your list or choose from suggestions
        </p>

        <div className="flex gap-3 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900"
          />
          <button
            onClick={addTask}
            className="px-4 py-3 rounded-lg bg-purple-600 text-white"
          >
            Add
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-600 light:text-slate-400 mb-3">
          Suggested tasks:
        </p>

        <div className="space-y-3">
          {taskExamples.map((example) => (
            <button
              key={example}
              onClick={() => handleAddTask(example)}
              className="btn-secondary w-full text-left justify-start"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="card-base p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-white light:text-slate-900">{task.title}</p>
              <p className="text-xs text-slate-400 light:text-slate-600">
                Status: {task.status}
              </p>
            </div>

            <div className="flex gap-2">
              {isFull ? (
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700 text-xs"
                >
                  Toggle
                </button>
              ) : (
                <button
                  onClick={handleLocked}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700 text-xs"
                >
                  Toggle
                </button>
              )}

              {isFull ? (
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={handleLocked}
                  className="px-3 py-2 rounded-lg bg-red-600/40 text-white/60 text-xs"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* LOCKED MODAL */}
      {showLockedModal && (
        <LockedFeatureModal
          onClose={() => setShowLockedModal(false)}
          onUnlock={handleUnlock}
        />
      )}

      {/* REDIRECT TO SETTINGS MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card-base max-w-sm w-full p-5">
            <p className="text-white light:text-slate-900 mb-4">
              Go to Settings → Unlock Full Version
            </p>
            <button
              onClick={() => setShowKeyModal(false)}
              className="w-full py-3 rounded-lg bg-purple-600 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}