import { useMemo } from "react";

export function useLeaderboardData(view: "global" | "friends" | "groups") {
  const mockData = [
    {
      userId: "1",
      name: "Yoichi",
      avatar: "/avatars/default1.png",
      totalPoints: 12450,
      weeklyPoints: 1240,
      dailyPoints: 240,
      longestStreak: 42,
      tasksCompleted: 1240,
      habitsCompleted: 520,
      focusMinutes: 12400,
    },
    {
      userId: "2",
      name: "Alex",
      avatar: "/avatars/default2.png",
      totalPoints: 11200,
      weeklyPoints: 980,
      dailyPoints: 180,
      longestStreak: 29,
      tasksCompleted: 1100,
      habitsCompleted: 480,
      focusMinutes: 11000,
    },
    {
      userId: "3",
      name: "Sara",
      avatar: "/avatars/default3.png",
      totalPoints: 9980,
      weeklyPoints: 1100,
      dailyPoints: 200,
      longestStreak: 31,
      tasksCompleted: 980,
      habitsCompleted: 540,
      focusMinutes: 9800,
    },
  ];

  const mockFriends = [
    mockData[1], // Alex
  ];

  const mockGroups = [
    {
      id: "group1",
      name: "Focus Masters",
      members: ["1", "3"], // Yoichi + Sara
    },
  ];

  return useMemo(() => {
    switch (view) {
      case "global":
        return mockData;

      case "friends":
        return mockFriends;

      case "groups":
        const group = mockGroups[0];
        return mockData.filter((entry) => group.members.includes(entry.userId));

      default:
        return mockData;
    }
  }, [view]);
}