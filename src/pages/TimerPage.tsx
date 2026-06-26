import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import LockedFeatureModal from "../components/LockedFeatureModal";

export default function TimerPage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { isDemo, isFull, handleStartSession, activeMinutes } = context;

  const [mode, setMode] = useState<"countdown" | "stopwatch" | "hybrid">(
    "countdown"
  );

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [running, setRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  const [progress, setProgress] = useState(0); // 0 to 1
  const totalSecondsRef = useRef(0);


  const handleLocked = () => setShowLockedModal(true);
  const handleUnlock = () => {
    setShowLockedModal(false);
    setShowKeyModal(true);
  };

  // START SESSION
  const startSession = () => {
    if (mode === "countdown") {
      const totalSecondsRef = hours * 3600 + minutes * 60;
      const newProgress = 1 - prev / totalSecondsRef.current;
      setProgress(newProgress);
    }

    if (mode === "stopwatch") {
      setProgress((p) => Math.min(1, p + 0.01));
    }

    if (mode === "hybrid") {
      if (prev > 0) {
        totalSecondsRef.current = hours * 3600 + minutes * 60;
        const newProgress = 1 - prev / totalSecondsRef.current;
        setProgress(newProgress);
      } else {
        // Stopwatch phase
        setProgress((p) => Math.min(1,p + 0.01));
      }
    };
  }

  // TIMER ENGINE
  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (mode === "countdown") {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            handleStartSession((hours * 60 + minutes));
            return 0;
          }
          return prev - 1;
        }

        if (mode === "stopwatch") {
          return prev + 1;
        }

        if (mode === "hybrid") {
          if (prev > 0) {
            return prev - 1;
          } else {
            return prev + 1;
          }
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [running, mode]);

 
  // FORMAT TIME
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };


  // DISPLAYED TIME
  const displayTime =
    running || timeLeft > 0
      ? formatTime(timeLeft)
      : `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;

  return (
    <div className="p-6 pb-24">
      {/* HEADER */}
      <h1 className="text-title-md text-white light:text-slate-900">
        Focus Timer
      </h1>
      <p className="text-sm text-slate-400 light:text-slate-600 mb-6">
        Deep work, reading, studying, coding — structured or open‑ended, your choice.
      </p>

      {/* MODE SELECTOR */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("countdown")}
          className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium ${
            mode === "countdown"
              ? "bg-purple-600 text-white"
              : "bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700"
          }`}
        >
          ⏳ Countdown
        </button>

        {isFull ? (
          <button
            onClick={() => setMode("stopwatch")}
            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium ${
              mode === "stopwatch"
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700"
            }`}
          >
            ⏱️ Stopwatch
          </button>
        ) : (
          <button
            onClick={handleLocked}
            className="flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700"
          >
            ⏱️ Stopwatch
          </button>
        )}

        {isFull ? (
          <button
            onClick={() => setMode("hybrid")}
            className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium ${
              mode === "hybrid"
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700"
            }`}
          >
            🔁 Hybrid
          </button>
        ) : (
          <button
            onClick={handleLocked}
            className="flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700"
          >
            🔁 Hybrid
          </button>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card-base p-4 text-center">
          <p className="text-xs text-slate-400 light:text-slate-600">
            TOTAL FOCUS TIME
          </p>
          <p className="text-title-md text-white light:text-slate-900">
            {activeMinutes} min
          </p>
        </div>

        <div className="card-base p-4 text-center">
          <p className="text-xs text-slate-400 light:text-slate-600">
            SESSIONS COMPLEPLETED
          </p>
          <p className="text-title-md text-white light:text-slate-900">
            {Math.floor(activeMinutes / 25)}
          </p>
        </div>
      </div>

      {/* TIMER CARD */}
      <div className="card-base p-6 text-center mb-6">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#334155"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#7c3aed"
              strokeWidth="10"
              fill="none"
              strokeDasharray={440}
              strokeDashoffset={440 - 440 * progress}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-slate-400 light:text-slate-600">
              {running ? "Running" : "Ready"}
            </p>
            <p className="text-3xl text-white light:text-slate-900">
              {displayTime}
            </p>
          </div>
        </div>

        {/* HOURS / MINUTES SELECTORS */}
        {!running && (
          <div className="flex justify-between mb-4">
            <div className="w-24">
              <p className="text-xs text-slate-400 light:text-slate-600 mb-1">
                Hours
              </p>
              <input
                type="number"
                min={0}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-center text-white light:text-slate-900"
              />
            </div>

            <div className="w-24">
              <p className="text-xs text-slate-400 light:text-slate-600 mb-1">
                Minutes
              </p>
              <input
                type="number"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-center text-white light:text-slate-900"
              />
            </div>
          </div>
        )}

        {/* START SESSION */}
        {!running && (
          <button
            onClick={startSession}
            className="w-full py-3 rounded-lg bg-blue-600 text-white"
          >
            Start Session
          </button>
        )}

        {/* STOP BUTTON */}
        {running && (
          <button
            onClick={() => setRunning(false)}
            className="w-full py-3 rounded-lg bg-red-600 text-white"
          >
            Stop
          </button>
        )}

        {/* ADJUST TIME */}
        {!isFull && (
          <button
            onClick={handleLocked}
            className="w-full mt-3 py-3 rounded-lg border border-slate-700 text-slate-300 light:text-slate-800"
          >
            Adjust Time (Locked)
          </button>
        )}

        {isFull && (
          <button className="w-full mt-3 py-3 rounded-lg border border-slate-700 text-slate-300 light:text-slate-800">
            Adjust Time
          </button>
        )}
      </div>

      {/* FOCUS TIPS */}
      <div className="card-base p-4">
        <h2 className="text-title-sm text-white light:text-slate-900 mb-2">
          Focus Tips
        </h2>
        <p className="text-xs text-slate-400 light:text-slate-600 mb-3">
          Get the most out of your focus sessions.
        </p>

        <ul className="text-sm text-slate-300 light:text-slate-700 space-y-2">
          <li>• Turn off notifications before starting.</li>
          <li>• Break long sessions into smaller intervals.</li>
        </ul>
      </div>

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