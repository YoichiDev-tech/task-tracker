export default function LeaderboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "Global", value: "global" },
    { label: "Friends", value: "friends" },
    { label: "Groups", value: "groups" },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`flex-1 py-2 rounded-lg text-sm ${
            activeTab === tab.value
              ? "bg-purple-600 text-white"
              : "bg-slate-800 text-slate-300 light:bg-slate-200 light:text-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}