import { eachDayOfInterval, subDays, format } from "date-fns";

type CalendarData = {
  [date: string]: number;
};

type ColorScheme = "green" | "blue" | "purple" | "orange";

type GitHubCalendarProps = {
  data: CalendarData;
  colorScheme?: ColorScheme;
};

const COLOR_SCALES: Record<ColorScheme, string[]> = {
  green: [
    "bg-slate-800 light:bg-slate-300",
    "bg-emerald-900 light:bg-emerald-300",
    "bg-emerald-700 light:bg-emerald-400",
    "bg-emerald-500 light:bg-emerald-500",
    "bg-emerald-400 light:bg-emerald-600",
  ],
  blue: [
    "bg-slate-800 light:bg-slate-300",
    "bg-sky-900 light:bg-sky-300",
    "bg-sky-700 light:bg-sky-400",
    "bg-sky-500 light:bg-sky-500",
    "bg-sky-400 light:bg-sky-600",
  ],
  purple: [
    "bg-slate-800 light:bg-slate-300",
    "bg-violet-900 light:bg-violet-300",
    "bg-violet-700 light:bg-violet-400",
    "bg-violet-500 light:bg-violet-500",
    "bg-violet-400 light:bg-violet-600",
  ],
  orange: [
    "bg-slate-800 light:bg-slate-300",
    "bg-orange-900 light:bg-orange-300",
    "bg-orange-700 light:bg-orange-400",
    "bg-orange-500 light:bg-orange-500",
    "bg-orange-400 light:bg-orange-600",
  ],
};

export default function GitHubCalendar({
  data,
  colorScheme = "green",
}: GitHubCalendarProps) {
  const end = new Date();
  const start = subDays(end, 364);
  const days = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach((day) => {
    if (currentWeek.length === 0 && day.getDay() !== 0) {
      for (let i = 0; i < day.getDay(); i++) {
        currentWeek.push(new Date(NaN));
      }
    }

    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(NaN));
    }
    weeks.push(currentWeek);
  }

  const values = Object.values(data);
  const maxValue = values.length ? Math.max(...values) : 0;

  const getLevel = (value: number) => {
    if (!value || maxValue === 0) return 0;
    const ratio = value / maxValue;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  };

  const getColor = (value: number) => {
    const level = getLevel(value);
    return COLOR_SCALES[colorScheme][level];
  };

  // Month labels (approx GitHub-style)
  const monthPositions: { label: string; index: number }[] = [];
  let lastMonth = "";
  weeks.forEach((week, index) => {
    const firstValid = week.find((d) => !isNaN(d.getTime()));
    if (!firstValid) return;
    const month = format(firstValid, "MMM");
    if (month !== lastMonth) {
      monthPositions.push({ label: month, index });
      lastMonth = month;
    }
  });

  return (
    <div className="overflow-x-auto py-4">
      <div className="mb-1 flex text-[10px] text-slate-400 light:text-slate-500 gap-4">
        {monthPositions.map((m) => (
          <span key={`${m.label}-${m.index}`}>{m.label}</span>
        ))}
      </div>

      <div className="flex gap-[3px]">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dIndex) => {
              if (isNaN(day.getTime())) {
                return (
                  <div
                    key={dIndex}
                    className="w-3 h-3 rounded-sm bg-transparent"
                  />
                );
              }

              const key = format(day, "yyyy-MM-dd");
              const value = data[key] || 0;

              return (
                <div
                  key={dIndex}
                  className={`w-3 h-3 rounded-sm transition-colors transition-transform duration-200 hover:scale-110 ${getColor(
                    value
                  )}`}
                  title={`${key}: ${value} activities`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}