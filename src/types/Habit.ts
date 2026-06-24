export type HabitFrequency = 'daily' | 'weekly' | 'yearly';

export type Habit = {
  id: number;
  title: string;
  frequency: HabitFrequency;
  time: string;
};
