import { useState, useContext } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="h-8 w-8 text-purple-600" />
          <h1 className="text-title-md text-white light:text-slate-900">Habit Tracking</h1>
        </div>
        <p className="text-subtitle">Build and maintain consistent habits for long-term success</p>
      </div>

      <div className="card-elevated mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-title-sm text-white light:text-slate-900">Create New Habit</h2>
            <p className="text-subtitle mt-2">Set up a habit with frequency and reminder time</p>
          </div>
          <Plus className="h-8 w-8 text-purple-500 opacity-20" />
        </div>

        {/* UPDATED FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Habit name..."
            autoFocus
            className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                       text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
              className="px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                         text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              {frequencies.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                         text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
          >
            <Plus className="h-5 w-5" />
            Add Habit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-base text-center">
          <p className="text-label">Daily</p>
          <p className="text-sm font-semibold text-white light:text-slate-900 mt-2">+5pts</p>
        </div>
        <div className="card-base text-center">
          <p className="text-label">Weekly</p>
          <p className="text-sm font-semibold text-white light:text-slate-900 mt-2">+10pts</p>
        </div>
        <div className="card-base text-center">
          <p className="text-label">Yearly</p>
          <p className="text-sm font-semibold text-white light:text-slate-900 mt-2">+50pts</p>
        </div>
      </div>

      <div className="card-base">
        <div className="mb-6">
          <h2 className="text-title-sm text-white light:text-slate-900">Your Habits</h2>
          <p className="text-subtitle mt-2 text-white light:text-slate-900">
            Total: {habits.length} habit{habits.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400">No habits yet. Create one to build consistency!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div>
                  <h3 className="font-medium text-white light:text-slate-900">{habit.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
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