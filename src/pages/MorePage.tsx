import { useContext, useState } from "react";
import { AppContext } from "../App";
import LockedFeatureModal from "../components/LockedFeatureModal";
import { Lock, X } from "lucide-react";

export default function MorePage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const {
    theme,
    toggleTheme,
    accessLevel,
    setAccessLevel,
    isDemo,
    isFull,
    language,
    setLanguage,
  } = context;

  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  const DEVELOPER_KEY = "Binka";

  const handleLocked = () => setShowLockedModal(true);

  const handleUnlock = () => {
    setShowLockedModal(false);
    setShowKeyModal(true);
  };

  const handleSubmitKey = () => {
    if (keyInput.trim() === DEVELOPER_KEY) {
      setAccessLevel("developer");
      setShowKeyModal(false);
      setKeyInput("");
      setError("");
    } else {
      setError("Incorrect key");
    }
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      {/* HEADER */}
      <h1 className="text-title-md text-white light:text-slate-900">
        Settings
      </h1>
      <p className="text-sm text-slate-400 light:text-slate-600 mb-6">
        Customize your experience and manage your app preferences.
      </p>

      {/* APPEARANCE */}
      <div className="card-base p-4 mb-6">
        <p className="text-white light:text-slate-900 mb-3">Appearance</p>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full py-3 rounded-lg bg-purple-600 text-white mb-4"
        >
          Toggle Theme ({theme})
        </button>

        {/* LANGUAGE SELECTOR */}
        <div className="mt-4">
          <p className="text-sm text-white light:text-slate-900 mb-2">
            Language
          </p>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900"
          >
            <option value="en">English</option>
            <option value="it">Italiano</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>

      {/* PREMIUM SECTIONS */}
      <div className="space-y-4 mb-10">
        {/* DASHBOARD */}
        <div className="card-base p-4 opacity-100">
          <div className="flex items-center justify-between">
            <p className="text-white light:text-slate-900">Dashboard</p>
            {!isFull && <Lock className="h-4 w-4 text-slate-500" />}
          </div>
          <p className="text-xs text-slate-400 light:text-slate-600">
            Customize your home dashboard layout.
          </p>
          {!isFull && (
            <button
              onClick={handleLocked}
              className="mt-3 w-full py-2 rounded-lg bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700 text-sm"
            >
              Unlock to Access
            </button>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="card-base p-4 opacity-100">
          <div className="flex items-center justify-between">
            <p className="text-white light:text-slate-900">Notifications</p>
            {!isFull && <Lock className="h-4 w-4 text-slate-500" />}
          </div>
          <p className="text-xs text-slate-400 light:text-slate-600">
            Set reminders for habits, tasks, and focus sessions.
          </p>
          {!isFull && (
            <button
              onClick={handleLocked}
              className="mt-3 w-full py-2 rounded-lg bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700 text-sm"
            >
              Unlock to Access
            </button>
          )}
        </div>

        {/* CALENDAR SYNC */}
        <div className="card-base p-4 opacity-100">
          <div className="flex items-center justify-between">
            <p className="text-white light:text-slate-900">Calendar Sync</p>
            {!isFull && <Lock className="h-4 w-4 text-slate-500" />}
          </div>
          <p className="text-xs text-slate-400 light:text-slate-600">
            Sync your tasks and habits with your calendar.
          </p>
          {!isFull && (
            <button
              onClick={handleLocked}
              className="mt-3 w-full py-2 rounded-lg bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700 text-sm"
            >
              Unlock to Access
            </button>
          )}
        </div>
      </div>

      {/* ACCESS LEVEL */}
      <div className="mt-12 pt-6 border-t border-slate-800 light:border-slate-300">
        <p className="text-xs text-slate-500 light:text-slate-600 mb-2">
          Access Level: {accessLevel}
        </p>

        {isDemo && (
          <button
            onClick={() => setShowKeyModal(true)}
            className="w-full py-3 rounded-lg bg-purple-600 text-white flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Unlock Full Version
          </button>
        )}

        {!isDemo && (
          <button
            onClick={() => setAccessLevel("demo")}
            className="w-full mt-3 py-3 rounded-lg border border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-800"
          >
            Reset to Demo Mode
          </button>
        )}
      </div>

      {/* LOCKED MODAL */}
      {showLockedModal && (
        <LockedFeatureModal
          onClose={() => setShowLockedModal(false)}
          onUnlock={handleUnlock}
        />
      )}

      {/* KEY ENTRY MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card-base max-w-sm w-full p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-title-sm text-white light:text-slate-900">
                Enter Access Key
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter key"
              className="w-full px-4 py-3 rounded-lg bg-slate-900 light:bg:white border border-slate-700 light:border-slate-300 text-white light:text-slate-900"
            />

            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            <button
              onClick={handleSubmitKey}
              className="w-full mt-4 py-3 rounded-lg bg-purple-600 text-white text-sm"
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}