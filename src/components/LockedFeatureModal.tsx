import { X } from "lucide-react";

interface LockedFeatureModalProps {
  onClose: () => void;
  onUnlock: () => void;
}

export default function LockedFeatureModal({ onClose, onUnlock }: LockedFeatureModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="card-base max-w-sm w-full p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-title-sm text-white light:text-slate-900">
            Premium Feature
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 light:text-slate-500 light:hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-slate-300 light:text-slate-700 mb-4">
          This feature is available only in the Full Version.
        </p>

        <button
          onClick={onUnlock}
          className="w-full py-3 rounded-lg bg-purple-600 text-white text-sm"
        >
          Unlock Full Version
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-3 rounded-lg border border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-800 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}