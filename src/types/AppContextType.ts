import { Task } from "./Task";
import { Habit } from "./Habit";

export interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;

  tasks: Task[];
  habits: Habit[];
  points: number;
  activeMinutes: number;
  language: string;
  setLanguage: (lang: string) => void;


  handleAddTask: (title: string) => void;
  handleDeleteTask: (taskId: number) => void;
  handleToggleTask: (taskId: number) => void;

  handleAddHabit: (habit: Habit) => void;
  handleStartSession: (duration: number) => void;

  accessLevel: "demo" | "full" | "developer";
  setAccessLevel: (level: "demo" | "full" | "developer") => void;

  isDemo: boolean;
  isFull: boolean;
  isDeveloper: boolean;
}