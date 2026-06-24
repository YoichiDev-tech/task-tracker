import { useState, useContext } from 'react';
import { CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { AppContext } from '../App';
import { HabitFrequency } from '../types/Habit';

const defaultTime = '08:00';

export default function HabitsPage() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { habits, handleAddHabit } = context;
  const frequencies: HabitFrequency[] = ['daily', 'weekly', 'yearly'];
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [time, setTime] = useState(defaultTime);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    handleAddHabit({ id: Date.now(), title: title.trim(), frequency, time });
    setTitle('');
    setFrequency('daily');
    setTime(defaultTime);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-title-md text-slate-900 dark:text-white">Habit Tracking</h1>
        </div>
        <p className="text-subtitle">Build and maintain consistent habits for long-term success</p>
      </div>

      {/* Add Habit Form */}
      <div className="card-elevated mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-title-sm text-slate-900 dark:text-white">Create New Habit</h2>
            <p className="text-subtitle mt-2">Set up a habit with frequency and reminder time</p>
          </div>
          <Plus className="h-8 w-8 text-purple-500 opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning meditation, Read 30 minutes"
              className="input-base"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                className="select-base"
              >
                {frequencies.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="select-base"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </form>
      </div>

      {/* Frequency Info Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-base text-center">
          <p className="text-label">Daily</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">+5pts</p>
        </div>
        <div className="card-base text-center">
          <p className="text-label">Weekly</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">+10pts</p>
        </div>
        <div className="card-base text-center">
          <p className="text-label">Yearly</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">+50pts</p>
        </div>
      </div>

      {/* Habits List */}
      <div className="card-base">
        <div className="mb-6">
          <h2 className="text-title-sm text-slate-900 dark:text-white">Your Habits</h2>
          <p className="text-subtitle mt-2">Total: {habits.length} habit{habits.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No habits yet. Create one to build consistency!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">{habit.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {habit.frequency} • Reminder at {habit.time}
                  </p>
                </div>
                <span className="badge-neutral capitalize">{habit.frequency}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
