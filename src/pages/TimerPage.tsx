import { useContext, useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  Pause,
  X,
  Plus,
  Minus,
  Target,
  Hourglass,
  Timer as TimerIcon,
} from 'lucide-react';
import { AppContext } from '../App';

type SessionMode = 'countdown' | 'stopwatch' | 'hybrid';

interface FocusSession {
  id: number;
  plannedMinutes: number;
  actualMinutes: number;
  status: 'in-progress' | 'completed' | 'stopped';
  startTime: number;
  endTime: number | null;
  mode: SessionMode;
}

const STORAGE_CURRENT = 'focus_current_session';
const STORAGE_HISTORY = 'focus_session_history';

export default function TimerPage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { activeMinutes, handleStartSession } = context;

  const [mode, setMode] = useState<SessionMode>('countdown');

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);

  const [targetMinutes, setTargetMinutes] = useState(60);

  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<FocusSession[]>([]);
  const [now, setNow] = useState(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  const [showSummary, setShowSummary] = useState(false);
  const [summarySession, setSummarySession] = useState<FocusSession | null>(null);

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustValue, setAdjustValue] = useState(5);

  const [streakMode, setStreakMode] = useState<'daily' | 'weekly'>('daily');

  const totalMinutes = hours * 60 + minutes;

  useEffect(() => {
    const savedCurrent = localStorage.getItem(STORAGE_CURRENT);
    if (savedCurrent) {
      const parsed: FocusSession = JSON.parse(savedCurrent);
      const nowTs = Date.now();

      if (parsed.mode === 'countdown' || parsed.mode === 'hybrid') {
        if (parsed.endTime && nowTs >= parsed.endTime && parsed.status === 'in-progress') {
          const elapsed = Math.max(
            0,
            Math.floor((parsed.endTime - parsed.startTime) / 60000)
          );
          const finished: FocusSession = {
            ...parsed,
            actualMinutes: elapsed,
          };
          setCurrentSession(finished);
          setIsFinished(true);
        } else {
          setCurrentSession(parsed);
        }
      } else {
        setCurrentSession(parsed);
      }
    }

    const savedHistory = localStorage.getItem(STORAGE_HISTORY);
    if (savedHistory) {
      setSessionHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (!currentSession || isFinished) return;

    let frameId: number;

    const tick = () => {
      const nowTs = Date.now();

      if (
        (currentSession.mode === 'countdown' || currentSession.mode === 'hybrid') &&
        currentSession.endTime &&
        nowTs >= currentSession.endTime
      ) {
        const elapsed = Math.max(
          0,
          Math.floor((currentSession.endTime - currentSession.startTime) / 60000)
        );
        const finished: FocusSession = {
          ...currentSession,
          actualMinutes: elapsed,
        };
        setCurrentSession(finished);
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(finished));
        setIsFinished(true);
        return;
      }

      setNow(nowTs);

      if (currentSession.mode === 'stopwatch' || currentSession.mode === 'hybrid') {
        const elapsed = Math.max(
          0,
          Math.floor((nowTs - currentSession.startTime) / 60000)
        );
        const updated: FocusSession = {
          ...currentSession,
          actualMinutes: elapsed,
        };
        setCurrentSession(updated);
        localStorage.setItem(STORAGE_CURRENT, JSON.stringify(updated));
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [currentSession, isFinished]);

  useEffect(() => {
    if (!currentSession) return;
    localStorage.setItem(STORAGE_CURRENT, JSON.stringify(currentSession));
  }, [currentSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  const startCountdown = () => {
    if (totalMinutes <= 0) return;
    const nowTs = Date.now();
    const session: FocusSession = {
      id: nowTs,
      plannedMinutes: totalMinutes,
      actualMinutes: 0,
      status: 'in-progress',
      startTime: nowTs,
      endTime: nowTs + totalMinutes * 60000,
      mode: 'countdown',
    };
    setCurrentSession(session);
    setIsFinished(false);
    setSummarySession(null);
    setShowSummary(false);
    localStorage.setItem(STORAGE_CURRENT, JSON.stringify(session));
  };

  const startStopwatch = () => {
    const nowTs = Date.now();
    const session: FocusSession = {
      id: nowTs,
      plannedMinutes: 0,
      actualMinutes: 0,
      status: 'in-progress',
      startTime: nowTs,
      endTime: null,
      mode: 'stopwatch',
    };
    setCurrentSession(session);
    setIsFinished(false);
    setSummarySession(null);
    setShowSummary(false);
    localStorage.setItem(STORAGE_CURRENT, JSON.stringify(session));
  };

  const startHybrid = () => {
    const nowTs = Date.now();
    const session: FocusSession = {
      id: nowTs,
      plannedMinutes: targetMinutes,
      actualMinutes: 0,
      status: 'in-progress',
      startTime: nowTs,
      endTime: nowTs + targetMinutes * 60000,
      mode: 'hybrid',
    };
    setCurrentSession(session);
    setIsFinished(false);
    setSummarySession(null);
    setShowSummary(false);
    localStorage.setItem(STORAGE_CURRENT, JSON.stringify(session));
  };

  const elapsedMs = useMemo(() => {
    if (!currentSession) return 0;
    if (currentSession.mode === 'stopwatch') {
      return Math.max(0, now - currentSession.startTime);
    }
    const base = isFinished && currentSession.endTime ? currentSession.endTime : now;
    return Math.max(0, base - currentSession.startTime);
  }, [currentSession, now, isFinished]);

  const remainingMs = useMemo(() => {
    if (!currentSession) return 0;
    if (currentSession.mode === 'stopwatch') return 0;
    if (!currentSession.endTime) return 0;
    return Math.max(
      0,
      currentSession.endTime - (isFinished ? currentSession.endTime : now)
    );
  }, [currentSession, now, isFinished]);

  const totalMs = useMemo(() => {
    if (!currentSession) return 0;
    if (currentSession.mode === 'stopwatch') {
      return currentSession.actualMinutes * 60000 || 1;
    }
    if (!currentSession.endTime) return 0;
    return Math.max(1, currentSession.endTime - currentSession.startTime);
  }, [currentSession]);

  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

  const displayTime = useMemo(() => {
    if (!currentSession) return '--';

    const baseMs =
      currentSession.mode === 'stopwatch'
        ? Math.max(0, now - currentSession.startTime)
        : remainingMs;

    if (baseMs <= 60000) {
      const secs = Math.floor(baseMs / 1000);
      return `${secs}s`;
    }

    const totalSec = Math.floor(baseMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);

    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }, [currentSession, remainingMs, now]);

  const progress = useMemo(() => {
    if (!currentSession) return 0;

    if (currentSession.mode === 'stopwatch') {
      if (currentSession.plannedMinutes <= 0) return 0;
      const elapsed = Math.max(0, now - currentSession.startTime);
      const total = currentSession.plannedMinutes * 60000;
      return Math.min(1, Math.max(0, elapsed / total));
    }

    return Math.min(1, Math.max(0, elapsedMs / totalMs));
  }, [elapsedMs, totalMs, currentSession, now]);

  const completeSession = () => {
    if (!currentSession) return;

    const final: FocusSession = {
      ...currentSession,
      status: 'completed',
      actualMinutes:
        currentSession.mode === 'countdown' || currentSession.mode === 'hybrid'
          ? currentSession.plannedMinutes
          : currentSession.actualMinutes,
    };

    setSessionHistory(prev => [...prev, final]);
    handleStartSession(final.actualMinutes);

    setCurrentSession(null);
    setIsFinished(false);
    setSummarySession(final);
    setShowSummary(true);
    localStorage.removeItem(STORAGE_CURRENT);
  };

  const stopSession = () => {
    if (!currentSession) return;

    const nowTs = Date.now();
    const elapsedMinutes = Math.max(
      0,
      Math.floor(
        (currentSession.mode === 'stopwatch'
          ? nowTs - currentSession.startTime
          : Math.min(nowTs, currentSession.endTime || nowTs) - currentSession.startTime) /
          60000
      )
    );

    const final: FocusSession = {
      ...currentSession,
      status: 'stopped',
      actualMinutes: elapsedMinutes,
    };

    setSessionHistory(prev => [...prev, final]);
    handleStartSession(final.actualMinutes);

    setCurrentSession(null);
    setIsFinished(false);
    setSummarySession(final);
    setShowSummary(true);
    localStorage.removeItem(STORAGE_CURRENT);
  };

  const openAdjust = () => {
    setAdjustValue(5);
    setAdjustOpen(true);
  };

  const applyAdjust = (sign: 'plus' | 'minus') => {
    if (!currentSession) return;
    const delta = adjustValue * (sign === 'plus' ? 1 : -1);
    const newPlanned = Math.max(1, currentSession.plannedMinutes + delta);

    if (currentSession.mode === 'stopwatch') {
      const updated: FocusSession = {
        ...currentSession,
        plannedMinutes: newPlanned,
      };
      setCurrentSession(updated);
      setAdjustOpen(false);
      return;
    }

    const nowTs = Date.now();
    const remaining = Math.max(0, (currentSession.endTime || nowTs) - nowTs);
    const ratio = remaining / (currentSession.endTime! - currentSession.startTime || 1);
    const newTotalMs = newPlanned * 60000;
    const newRemainingMs = newTotalMs * ratio;
    const newEnd = nowTs + newRemainingMs;

    const updated: FocusSession = {
      ...currentSession,
      plannedMinutes: newPlanned,
      endTime: newEnd,
    };
    setCurrentSession(updated);
    setIsFinished(false);
    setAdjustOpen(false);
  };

  const totalSessions = sessionHistory.length;
  const longestSession = totalSessions
    ? Math.max(...sessionHistory.map(s => s.actualMinutes))
    : 0;
  const averageSession = totalSessions
    ? Math.round(
        sessionHistory.reduce((sum, s) => sum + s.actualMinutes, 0) / totalSessions
      )
    : 0;

  const todayKey = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  };

  const getDailyStreak = () => {
    if (!sessionHistory.length) return 0;
    const dates = Array.from(
      new Set(sessionHistory.map(s => new Date(s.startTime).toISOString().slice(0, 10)))
    ).sort();
    const today = todayKey();
    if (!dates.includes(today)) return 0;

    let streak = 1;
    let cursor = new Date(today);

    while (true) {
      cursor.setDate(cursor.getDate() - 1);
      const key = cursor.toISOString().slice(0, 10);
      if (dates.includes(key)) streak += 1;
      else break;
    }

    return streak;
  };

  const getWeeklyStreak = () => {
    if (!sessionHistory.length) return 0;
    const today = new Date(todayKey());
    let streak = 0;

    while (true) {
      const end = new Date(today);
      end.setDate(end.getDate() - streak * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      const hasSession = sessionHistory.some(s => {
        const d = new Date(s.startTime);
        return d >= start && d <= end;
      });

      if (hasSession) streak += 1;
      else break;
    }

    return streak;
  };

  const dailyStreak = getDailyStreak();
  const weeklyStreak = getWeeklyStreak();

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const showRing =
    currentSession &&
    ((currentSession.mode === 'countdown' && currentSession.plannedMinutes > 0) ||
      (currentSession.mode === 'hybrid' && currentSession.plannedMinutes > 0) ||
      (currentSession.mode === 'stopwatch' && currentSession.plannedMinutes > 0));

  return (
    <div className="flex flex-col min-h-screen pb-24 pt-6 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-8 w-8 text-orange-600" />
          <h1 className="text-title-md text-white light:text-slate-900">Focus Timer</h1>
        </div>
        <p className="text-subtitle">
          Deep work, reading, studying, coding — structured or open‑ended, your choice.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('countdown')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm transition
            ${
              mode === 'countdown'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/40'
                : 'bg-slate-900 light:bg-slate-100 text-slate-300 light:text-slate-700'
            }`}
        >
          <TimerIcon className="h-4 w-4" />
          <span>Countdown</span>
        </button>
        <button
          onClick={() => setMode('stopwatch')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm transition
            ${
              mode === 'stopwatch'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'
                : 'bg-slate-900 light:bg-slate-100 text-slate-300 light:text-slate-700'
            }`}
        >
          <Hourglass className="h-4 w-4" />
          <span>Stopwatch</span>
        </button>
        <button
          onClick={() => setMode('hybrid')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-full text-sm transition
            ${
              mode === 'hybrid'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40'
                : 'bg-slate-900 light:bg-slate-100 text-slate-300 light:text-slate-700'
            }`}
        >
          <Target className="h-4 w-4" />
          <span>Hybrid</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <p className="text-label">Total Focus Time</p>
            <Clock className="h-6 w-6 text-orange-500 opacity-20" />
          </div>
          <p className="text-4xl font-bold text-white light:text-slate-900">{activeMinutes}</p>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-2">minutes accumulated</p>
        </div>

        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <p className="text-label">Sessions Completed</p>
            <CheckCircle2 className="h-6 w-6 text-green-500 opacity-20" />
          </div>
          <p className="text-4xl font-bold text-white light:text-slate-900">
            {totalSessions}
          </p>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-2">total sessions</p>
        </div>
      </div>

      <div className="card-elevated mb-8">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="text-slate-800 light:text-slate-200"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
              />
              {showRing && (
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className={
                    mode === 'countdown'
                      ? 'text-orange-500'
                      : mode === 'stopwatch'
                      ? 'text-blue-500'
                      : 'text-purple-500'
                  }
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.2s linear' }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-slate-400 light:text-slate-600 mb-1">
                {currentSession ? (mode === 'stopwatch' ? 'Elapsed' : 'Remaining') : 'Ready'}
              </p>
              <p className="text-2xl font-semibold text-white light:text-slate-900">
                {currentSession ? displayTime : '--'}
              </p>
            </div>
          </div>

          {!currentSession && mode === 'countdown' && (
            <div className="w-full max-w-sm">
              <p className="text-label mb-3 text-center">Choose Session Duration</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 light:text-slate-600 mb-1">Hours</p>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                               text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-400 light:text-slate-600 mb-1">Minutes</p>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) =>
                      setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))
                    }
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                               text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {!currentSession && mode === 'hybrid' && (
            <div className="w-full max-w-sm mt-2">
              <p className="text-label mb-3 text-center">Set Target (optional)</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-xs text-slate-400 light:text-slate-600 mb-1">
                    Target minutes
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={targetMinutes}
                    onChange={(e) =>
                      setTargetMinutes(Math.max(1, Number(e.target.value)))
                    }
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                               text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {currentSession && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={openAdjust}
                className="px-3 py-2 rounded-lg border border-slate-700 light:border-slate-300 text-xs text-slate-200 light:text-slate-800 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <Minus className="h-3 w-3" />
                Adjust time
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {!currentSession && mode === 'countdown' && (
            <button
              onClick={startCountdown}
              className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Start {totalMinutes > 0 ? `${totalMinutes} min` : ''} Session
            </button>
          )}

          {!currentSession && mode === 'stopwatch' && (
            <button
              onClick={startStopwatch}
              className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Start Stopwatch Session
            </button>
          )}

          {!currentSession && mode === 'hybrid' && (
            <button
              onClick={startHybrid}
              className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Start Hybrid Session
            </button>
          )}

          {currentSession && (
            <>
              <button
                onClick={completeSession}
                className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Completed
              </button>
              <button
                onClick={stopSession}
                className="w-full text-sm py-3 flex items-center justify-center gap-2 rounded-lg border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-800"
              >
                <Pause className="h-4 w-4" />
                Stop & Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-base mb-8">
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-title-sm text-white light:text-slate-900">Focus Mode Tips</h2>
            <p className="text-subtitle mt-1">Get the most out of your focus sessions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">1</span>
            </div>
            <div>
              <p className="font-medium text-white light:text-slate-900">Set a single goal</p>
              <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
                Define what you want to accomplish in this session.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">2</span>
            </div>
            <div>
              <p className="font-medium text-white light:text-slate-900">Eliminate distractions</p>
              <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
                Silence notifications, close unnecessary tabs, and commit fully.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-green-600">3</span>
            </div>
            <div>
              <p className="font-medium text-white light:text-slate-900">Take proper breaks</p>
              <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
                Use your breaks to rest, not to doom‑scroll.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <span className="text-sm font-bold text-orange-600">4</span>
            </div>
            <div>
              <p className="font-medium text-white light:text-slate-900">Review your work</p>
              <p className="text-sm text-slate-400 light:text-slate-600 mt-1">
                When the session ends, reflect on what you actually accomplished.
              </p>
            </div>
          </div>
        </div>
      </div>

      {adjustOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="card-base max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm text-white light:text-slate-900">Adjust Session Time</h3>
              <button
                onClick={() => setAdjustOpen(false)}
                className="text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 light:text-slate-600 mb-3">
              Add or remove minutes from the current session. This won&apos;t reset your progress.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <input
                type="number"
                min="1"
                max="240"
                value={adjustValue}
                onChange={(e) => setAdjustValue(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                           text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
              />
              <span className="text-xs text-slate-400 light:text-slate-600">minutes</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => applyAdjust('plus')}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                Add time
              </button>
              <button
                onClick={() => applyAdjust('minus')}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm rounded-lg border border-slate-700 light:border-slate-300 text-slate-200 light:text-slate-800"
              >
                <Minus className="h-4 w-4" />
                Reduce time
              </button>
            </div>
          </div>
        </div>
      )}

      {showSummary && summarySession && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
          <div className="card-base max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm text-white light:text-slate-900">Session Summary</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-slate-300 light:text-slate-800 mb-4">
              {summarySession.status === 'completed'
                ? 'Nice work. You completed your focus session.'
                : 'You stopped early, but the time you focused still counts.'}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-900 light:bg-slate-100">
                <p className="text-xs text-slate-400 light:text-slate-600 mb-1">Planned</p>
                <p className="text-sm font-semibold text-white light:text-slate-900">
                  {summarySession.plannedMinutes} min
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 light:bg-slate-100">
                <p className="text-xs text-slate-400 light:text-slate-600 mb-1">Focused</p>
                <p className="text-sm font-semibold text-white light:text-slate-900">
                  {summarySession.actualMinutes} min
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 light:border-slate-200 pt-3 mt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400 light:text-slate-600">Longest session</p>
                <p className="text-xs text-white light:text-slate-900">{longestSession} min</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400 light:text-slate-600">Average session</p>
                <p className="text-xs text-white light:text-slate-900">{averageSession} min</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400 light:text-slate-600">Streak</p>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      onClick={() => setStreakMode('daily')}
                      className={`px-2 py-0.5 rounded-full ${
                        streakMode === 'daily'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700'
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setStreakMode('weekly')}
                      className={`px-2 py-0.5 rounded-full ${
                        streakMode === 'weekly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700'
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>
                <p className="text-xs text-white light:text-slate-900">
                  {streakMode === 'daily' ? dailyStreak : weeklyStreak}{' '}
                  {streakMode === 'daily' ? 'days' : 'weeks'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSummary(false)}
              className="btn-primary w-full mt-4 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}