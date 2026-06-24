import { useContext } from 'react';
import { Clock, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppContext } from '../App';

export default function TimerPage() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { activeMinutes, handleStartSession } = context;

  const focusMinutes = 25;
  const breakMinutes = 5;

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          <h1 className="text-title-md text-slate-900 dark:text-white">Focus Timer</h1>
        </div>
        <p className="text-subtitle">Pomodoro-style focus sessions to maximize productivity</p>
      </div>

      {/* Session Stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <p className="text-label">Total Focus Time</p>
            <Clock className="h-6 w-6 text-orange-500 opacity-20" />
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">{activeMinutes}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">minutes accumulated</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <p className="text-label">Sessions Completed</p>
            <CheckCircle2 className="h-6 w-6 text-green-500 opacity-20" />
          </div>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">{Math.floor(activeMinutes / focusMinutes)}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Pomodoro sessions</p>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="card-elevated mb-8">
        <div className="text-center mb-8">
          <p className="text-label mb-4">Session Duration</p>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Work</p>
              <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mt-2">{focusMinutes}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">minutes</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Break</p>
              <p className="text-5xl font-bold text-green-600 dark:text-green-400 mt-2">{breakMinutes}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">minutes</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartSession}
          className="btn-primary w-full text-lg py-4"
        >
          <Play className="h-5 w-5" />
          Start Focus Session
        </button>
      </div>

      {/* Tips */}
      <div className="card-base">
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-title-sm text-slate-900 dark:text-white">Focus Mode Tips</h2>
            <p className="text-subtitle mt-1">Get the most out of your focus sessions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Set a single goal</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Define what you want to accomplish in this session</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2</span>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Eliminate distractions</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Silence notifications, close unnecessary tabs, and commit fully</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-green-600 dark:text-green-400">3</span>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Take proper breaks</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use the 5-minute break to rest and recharge</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">4</span>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Review your work</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">When the session ends, review what you accomplished</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
