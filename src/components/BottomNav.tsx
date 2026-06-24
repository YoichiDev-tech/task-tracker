import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare2, ListTodo, Clock, MoreHorizontal } from 'lucide-react';

const items = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/habits', label: 'Habits', icon: CheckSquare2 },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/timer', label: 'Timer', icon: Clock },
  { path: '/more', label: 'More', icon: MoreHorizontal },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 light:bg-white/80 backdrop-blur-xl border-t border-slate-800 light:border-slate-200">
      <div className="mx-auto max-w-md flex h-20 items-center justify-around px-4">
        {items.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                active
                  ? 'text-blue-400 bg-blue-500/10 light:text-blue-600 light:bg-blue-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}