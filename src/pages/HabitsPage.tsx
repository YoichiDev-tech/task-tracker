import { useContext, useState } from "react";
import { AppContext } from "../App";
import LockedFeatureModal from "../components/LockedFeatureModal";
import GitHubCalendar from "../components/GitHubCalendar";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function HabitsPage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const {
    habits,
    handleAddHabit,
    handleUpdateHabit,
    isDemo,
    isFull,
  } = context;

  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState("daily");
  const [newHabitTime, setNewHabitTime] = useState("09:00");

  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const [view, setView] = useState<"single" | "weekly" | "yearly">("single");
  const [showMonth, setShowMonth] = useState(false);

  const handleLocked = () => setShowLockedModal(true);
  const handleUnlock = () => {
    setShowLockedModal(false);
    setShowKeyModal(true);
  };

  const addHabit = () => {
    if (!newHabitTitle.trim()) return;

    const habit = {
      id: Date.now(),
      title: newHabitTitle.trim(),
      frequency: newHabitFrequency,
      time: newHabitTime,
      history: [], // REQUIRED for streaks
    };

    handleAddHabit(habit);

    setNewHabitTitle("");
    setNewHabitFrequency("daily");
    setNewHabitTime("09:00");
  };

  const completeHabit = (habitId: number) => {
    const today = format(new Date(), "yyyy-MM-dd");

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    if ((habit.history ?? []).includes(today)) return;

    const updated = {
      ...habit,
      history: [...(habit.history ?? []), today],
    };

    handleUpdateHabit(updated);
  };

  // WEEKLY VIEW DATA
  const getWeeklyData = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      const key = format(date, "yyyy-MM-dd");

      const count = (habits ?? []).reduce(
        (acc, h) => ((h.history ?? []).includes(key) ? acc + 1 : acc),
        0
      );

      return { date, key, count };
    });

    return days;
  };

  const weekly = getWeeklyData();

  // MONTHLY VIEW DATA (for expanded weekly)
  const getMonthlyData = () => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });

    const map: { [date: string]: number } = {};

    days.forEach((d) => {
      const key = format(d, "yyyy-MM-dd");
      const count = (habits ?? []).reduce(
        (acc, h) => ((h.history ?? []).includes(key) ? acc + 1 : acc),
        0
      );
      map[key] = count;
    });

    return map;
  };

  const monthlyData = getMonthlyData();

  // YEARLY VIEW DATA
  const getYearlyData = () => {
    const map: { [date: string]: number } = {};

    (habits ?? []).forEach((habit) => {
      (habit.history ?? []).forEach((date) => {
        map[date] = (map[date] || 0) + 1;
      });
    });

    return map;
  };

  const yearlyData = getYearlyData();

  return (
    <div className="p-6 pb-24">
      {/* HEADER */}
      <h1 className="text-title-md text-white light:text-slate-900">
        Habit Tracking
      </h1>
      <p className="text-sm text-slate-400 light:text-slate-600 mb-4">
        Build and maintain consistent habits for long-term success.
      </p>

      {/* NEW TOGGLE */}
      <div className="flex gap-2 mb-6">
        {["single", "weekly", "yearly"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            className={`px-4 py-2 rounded-full text-sm border ${
              view === v
                ? "bg-purple-600 text-white border-purple-600"
                : "text-slate-300 light:text-slate-700 border-slate-700 light:border-slate-300"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* SINGLE VIEW */}
      {view === "single" && (
        <>
          {/* CREATE HABIT CARD */}
          <div className="card-base p-4 mb-6">
            <p className="text-xs text-slate-400 light:text-slate-600 mb-3">
              Set up a habit with frequency and reminder time
            </p>

            <input
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="Habit title"
              className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 mb-3"
            />

            <select
              value={newHabitFrequency}
              onChange={(e) => setNewHabitFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 mb-3"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="time"
              value={newHabitTime}
              onChange={(e) => setNewHabitTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 mb-3"
            />

            <button
              onClick={addHabit}
              className="w-full py-3 rounded-lg bg-purple-600 text-white"
            >
              Add Habit
            </button>
          </div>

          {/* HABIT LIST */}
          <div className="space-y-3">
            {(habits ?? []).map((habit) => (
              <div
                key={habit.id}
                className="card-base p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white light:text-slate-900">{habit.title}</p>
                  <p className="text-xs text-slate-400 light:text-slate-600">
                    {habit.frequency} at {habit.time}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs"
                  >
                    Check
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* WEEKLY VIEW */}
      {view === "weekly" && (
        <div>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekly.map((d) => (
              <div
                key={d.key}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs ${
                  d.count > 0
                    ? "bg-green-600 text-white"
                    : "bg-slate-800 light:bg-slate-300 text-slate-400"
                }`}
              >
                {format(d.date, "EEE")[0]}
              </div>
            ))}
          </div>

          <p
            className="text-center text-xs text-slate-400 light:text-slate-600 mb-3 underline"
            onClick={() => setShowMonth(!showMonth)}
          >
            Tap to check
          </p>

          {showMonth && (
            <GitHubCalendar data={monthlyData} colorScheme="green" />
          )}
        </div>
      )}

      {/* YEARLY VIEW */}
      {view === "yearly" && (
        <GitHubCalendar data={yearlyData} colorScheme="green" />
      )}

      {/* LOCKED MODAL */}
      {showLockedModal && (
        <LockedFeatureModal
          onClose={() => setShowLockedModal(false)}
          onUnlock={handleUnlock}
        />
      )}

      {/* REDIRECT TO SETTINGS MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card-base max-w-sm w-full p-5">
            <p className="text-white light:text-slate-900 mb-4">
              Go to Settings → Unlock Full Version
            </p>
            <button
              onClick={() => setShowKeyModal(false)}
              className="w-full py-3 rounded-lg bg-purple-600 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}