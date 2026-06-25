import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { AppContext } from '../App';

export default function HomePage() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) return null;

  const { points, tasks, habits, activeMinutes, userName } = context;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-title-lg text-white light:text-slate-900">
            {userName && userName.trim() !== ""
              ? `Welcome back, ${userName}`
              : "Welcome back"}
          </h1>
          <p className="text-subtitle mt-2">
            Track your tasks, build your habits, focus your time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-base">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label">Points</p>
              <p className="text-2xl font-bold text-white light:text-slate-900 mt-2">
                {points}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="card-base">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label">Tasks</p>
              <p className="text-2xl font-bold text-white light:text-slate-900 mt-2">
                {tasks.length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="card-base">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label">Habits</p>
              <p className="text-2xl font-bold text-white light:text-slate-900 mt-2">
                {habits.length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="card-base">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label">Focus Time</p>
              <p className="text-2xl font-bold text-white light:text-slate-900 mt-2">
                {activeMinutes}m
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card-elevated">
          <div className="mb-6">
            <h2 className="text-title-sm text-white light:text-slate-900">
              Task Management
            </h2>
            <p className="text-subtitle mt-2">
              Create and track your tasks. Organize your work efficiently.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body">Total tasks</span>
              <span className="font-semibold text-white light:text-slate-900">
                {tasks.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body">Completion rate</span>
              <span className="font-semibold text-green-600 light:text-green-700">
                {completionRate}%
              </span>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="btn-primary w-full mt-4"
            >
              Manage Tasks <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="card-elevated">
          <div className="mb-6">
            <h2 className="text-title-sm text-white light:text-slate-900">
              Habit Tracking
            </h2>
            <p className="text-subtitle mt-2">
              Build and track habits. Consistency leads to growth.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body">Active habits</span>
              <span className="font-semibold text-white light:text-slate-900">
                {habits.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body">Habit streak</span>
              <span className="font-semibold text-purple-600 light:text-purple-700">
                7 days
              </span>
            </div>
            <button
              onClick={() => navigate('/habits')}
              className="btn-primary w-full mt-4"
            >
              View Habits <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card-elevated mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-title-sm text-white light:text-slate-900">
              Focus Timer
            </h2>
            <p className="text-subtitle mt-2">25-minute focused work sessions</p>
          </div>
          <Clock className="h-10 w-10 text-orange-500 opacity-20" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 light:bg-white dark:bg-slate-950 rounded-lg p-4 text-center">
            <p className="text-label">Total Focus Time</p>
            <p className="text-3xl font-bold text-orange-600 light:text-orange-700 mt-2">
              {activeMinutes}
            </p>
            <p className="text-xs text-slate-600 light:text-slate-700 dark:text-slate-400 mt-1">
              minutes
            </p>
          </div>
          <button
            onClick={() => navigate('/timer')}
            className="btn-primary"
          >
            Start Focus Session
          </button>
        </div>
      </div>

      <div className="card-base">
        <h2 className="text-title-sm text-white light:text-slate-900 mb-4">
          How Points Work
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="badge-primary">+10</span>
            <p className="text-body mt-2">Per completed task</p>
          </div>
          <div>
            <span className="badge-primary">+5</span>
            <p className="text-body mt-2">Per new habit</p>
          </div>
          <div>
            <span className="badge-primary">+2</span>
            <p className="text-body mt-2">Per focus session</p>
          </div>
        </div>
      </div>
    </div>
  );
}