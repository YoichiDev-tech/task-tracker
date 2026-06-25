export interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;

  tasks: Task[];
  habits: Habit[];
  points: number;
  activeMinutes: number;

  handleAddTask: (title: string) => void;
  handleDeleteTask: (taskId: number) => void;
  handleToggleTask: (taskId: number) => void;
  handleAddHabit: (habit: Habit) => void;
  handleUpdateHabit: (habit: Habit) => void;
  handleStartSession: (duration: number) => void;

  accessLevel: "demo" | "full" | "developer";
  setAccessLevel: (level: "demo" | "full" | "developer") => void;
  isDemo: boolean;
  isFull: boolean;
  isDeveloper: boolean;

  userName: string;            
  setUserName: (name: string) => void; 
}