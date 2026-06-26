import LeaderboardCategory from "../../components/LeaderboardCategory/LeaderboardCategory";
import { useLeaderboardData } from "../../hooks/useLeaderboardData";

export default function LeaderboardContent({ activeTab }) {
  const data = useLeaderboardData(activeTab);

  return (
    <div className="space-y-6">
      <LeaderboardCategory title="Total Points" entries={data} sortKey="totalPoints" />
      <LeaderboardCategory title="Weekly Points" entries={data} sortKey="weeklyPoints" />
      <LeaderboardCategory title="Daily Points" entries={data} sortKey="dailyPoints" />
      <LeaderboardCategory title="Longest Streak" entries={data} sortKey="longestStreak" />
      <LeaderboardCategory title="Tasks Completed" entries={data} sortKey="tasksCompleted" />
      <LeaderboardCategory title="Habits Completed" entries={data} sortKey="habitsCompleted" />
      <LeaderboardCategory title="Focus Minutes" entries={data} sortKey="focusMinutes" />
    </div>
  );
}