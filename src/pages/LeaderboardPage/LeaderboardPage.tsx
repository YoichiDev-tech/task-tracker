import { useContext, useState } from "react";
import { AppContext } from "../../App";

import LeaderboardTabs from "./LeaderboardTabs";
import LeaderboardContent from "./LeaderboardContent";

import PremiumLockOverlay from "../../components/PremiumLockOverlay";
import FloatingRankUpToast from "../../components/FloatingRankUpToast";

export default function LeaderboardPage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { isFull, isDeveloper } = context;
  const isPremium = isFull || isDeveloper;

  const [activeTab, setActiveTab] = useState<"global" | "friends" | "groups">("global");

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <h1 className="text-title-md text-white light:text-slate-900 mb-4">
        Leaderboard
      </h1>

      <LeaderboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {!isPremium && <PremiumLockOverlay />}

      {isPremium && (
        <LeaderboardContent activeTab={activeTab} />
      )}

      <FloatingRankUpToast />
    </div>
  );
}