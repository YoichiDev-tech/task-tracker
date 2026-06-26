import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

export default function LeaderboardToggleButton() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) return null;

  const { isFull, isDeveloper } = context;
  const isPremium = isFull || isDeveloper;

  const handleClick = () => {
    if (!isPremium) {
      context.setShowPremiumModal(true);
      return;
    }
    navigate("/leaderboard");
  };

  return (
    <button
      onClick={handleClick}
      className="
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        bg-purple-600 text-white
        text-base font-medium
        hover:bg-purple-700 transition
        shadow-sm
      "
    >
      <span className="text-lg">🏆</span>
      <span>Leaderboard</span>
    </button>
  );
}