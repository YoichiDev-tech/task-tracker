import { useEffect, useState } from "react";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Habit } from "./types/Habit";
import { Task } from "./types/Task";
import { AppContextType } from "./types/AppContextType";

import BottomNav from "./components/BottomNav";
import HomePage from "./pages/HomePage";
import HabitsPage from "./pages/HabitsPage";
import TasksPage from "./pages/TasksPage";
import TimerPage from "./pages/TimerPage";
import MorePage from "./pages/MorePage";

const APP_STORAGE_KEY = "task-tracker-app-v2";
const APP_THEME_KEY = "task-tracker-theme";
const ACCESS_LEVEL_KEY = "task-tracker-access-level";

function getDefaultTasks(): Task[] {
  return [
    { id: 1, title: "Review project requirements", status: "todo" },
    { id: 2, title: "Complete implementation phase", status: "in-progress" },
  ];
}

function getDefaultHabits(): Habit[] {
  return [
    { id: 1, title: "Daily standup", frequency: "daily", time: "09:00" },
    { id: 2, title: "Weekly review", frequency: "weekly", time: "17:00" },
  ];
}

export const AppContext = React.createContext<AppContextType | undefined>(
  undefined
);

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem(APP_THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const [accessLevel, setAccessLevel] = useState<
    "demo" | "full" | "developer"
  >(() => {
    const saved = localStorage.getItem(ACCESS_LEVEL_KEY);
    if (saved === "demo" || saved === "full" || saved === "developer")
      return saved;
    return "demo";
  });

  const isDemo = accessLevel === "demo";
  const isFull = accessLevel === "full" || accessLevel === "developer";
  const isDeveloper = accessLevel === "developer";

  useEffect(() => {
    localStorage.setItem(ACCESS_LEVEL_KEY, accessLevel);
  }, [accessLevel]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [points, setPoints] = useState(120);
  const [activeMinutes, setActiveMinutes] = useState(0);

  // New - needed for calendar data
  const [focusSessions, setFocusSessions] = useState<
    { date: string; minutes: number }[]
  >([]);

  // NEW — Language setting
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem(APP_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (!saved) {
      setTasks(getDefaultTasks());
      setHabits(getDefaultHabits());
      return;
    }

    try {
      const payload = JSON.parse(saved) as {
        tasks?: Task[];
        habits?: Habit[];
        points?: number;
        activeMinutes?: number;
      };

      setTasks(payload.tasks ?? getDefaultTasks());
      setHabits(payload.habits ?? getDefaultHabits());
      setPoints(payload.points ?? 120);
      setActiveMinutes(payload.activeMinutes ?? 0);
    } catch {
      setTasks(getDefaultTasks());
      setHabits(getDefaultHabits());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      APP_STORAGE_KEY,
      JSON.stringify({ tasks, habits, points, activeMinutes })
    );
  }, [tasks, habits, points, activeMinutes]);

  const handleAddTask = (title: string) => {
    setTasks((prev) => [...prev, { id: Date.now(), title, status: "todo" }]);
    setPoints((prev) => prev + 10);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleToggleTask = (taskId: number) => {
    const next = (s: Task["status"]): Task["status"] =>
      s === "todo"
        ? "in-progress"
        : s === "in-progress"
        ? "completed"
        : "todo";

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: next(task.status) } : task
      )
    );
  };

  const handleAddHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
    setPoints((prev) => prev + 5);
  };

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };

  const handleStartSession = (duration: number) => {
    setActiveMinutes((prev) => prev + duration);
    setPoints((prev) => prev + 2);
  };

  const value: AppContextType = {
    theme,
    toggleTheme,

    tasks,
    habits,
    points,
    activeMinutes,

    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    handleAddHabit,
    handleUpdateHabit,
    handleStartSession,

    accessLevel,
    setAccessLevel,
    isDemo,
    isFull,
    isDeveloper,
  };

  return (
    <AppContext.Provider value={value}>
      <BrowserRouter>
        <div className="min-h-screen w-full bg-slate-950 light:bg-white flex justify-center">
          <div className="w-full max-w-md bg-slate-950 light:bg-white relative pb-24">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/more" element={<MorePage />} />
            </Routes>
            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}