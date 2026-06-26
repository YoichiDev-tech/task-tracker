export default function PremiumLockOverlay() {
  return (
    <div className="bg-slate-900/80 light:bg-white/80 backdrop-blur-md rounded-xl p-6 text-center border border-slate-700 light:border-slate-300 shadow-lg">
      
      <h2 className="text-xl font-semibold text-white light:text-slate-900 mb-2">
        Leaderboard is a Premium Feature
      </h2>

      <p className="text-slate-300 light:text-slate-600 text-sm mb-4">
        Unlock RankUp Premium to access:
      </p>

      <ul className="text-slate-400 light:text-slate-700 text-sm space-y-1 mb-6">
        <li>• Global rankings</li>
        <li>• Friends leaderboard</li>
        <li>• Private groups</li>
        <li>• Rank badges</li>
        <li>• Weekly resets</li>
        <li>• Animated rank-up transitions</li>
      </ul>

      <button className="w-full py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
        Unlock Premium
      </button>
    </div>
  );
}