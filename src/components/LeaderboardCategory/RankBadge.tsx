export default function RankBadge({ rank }) {
  const colors = {
    1: "bg-yellow-400",
    2: "bg-gray-300",
    3: "bg-amber-600",
  };

  return (
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-black font-bold text-sm ${colors[rank]}`}
    >
      {rank}
    </div>
  );
}