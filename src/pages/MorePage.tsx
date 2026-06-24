import { useContext } from 'react';
import { MoreHorizontal, Settings, Heart, BarChart3, MessageSquare, Trophy, BookOpen, FileText, Zap } from 'lucide-react';
import { AppContext } from '../App';

const menuItems = [
  { label: 'Goals', icon: Zap, description: 'Set and track your long-term goals' },
  { label: 'Analytics', icon: BarChart3, description: 'View detailed productivity insights' },
  { label: 'Badges', icon: Trophy, description: 'Collect achievement badges' },
  { label: 'Notes', icon: FileText, description: 'Keep personal notes and ideas' },
  { label: 'Help', icon: MessageSquare, description: 'Get help and support' },
  { label: 'Settings', icon: Settings, description: 'Customize your preferences' },
];

export default function MorePage() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { points, toggleTheme, theme } = context;

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <MoreHorizontal className="h-8 w-8 text-slate-600 dark:text-slate-400" />
          <h1 className="text-title-md text-slate-900 dark:text-white">More Options</h1>
        </div>
        <p className="text-subtitle">Additional features and settings to enhance your productivity</p>
      </div>

      {/* Points Card */}
      <div className="card-elevated mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label">Total Points</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-3">{points}</p>
          </div>
          <Zap className="h-12 w-12 text-yellow-500 opacity-20" />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="card-base text-left hover:shadow-md transition group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.label}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Theme & Account */}
      <div className="card-base">
        <h2 className="text-title-sm text-slate-900 dark:text-white mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Theme</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Light or dark mode</p>
            </div>
            <button onClick={toggleTheme} className="btn-secondary capitalize">
              {theme}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Notifications</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Habit and task reminders</p>
            </div>
            <button className="btn-secondary">Manage</button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Data & Privacy</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Export or delete your data</p>
            </div>
            <button className="btn-secondary">Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}
