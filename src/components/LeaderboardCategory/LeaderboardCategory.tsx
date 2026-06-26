import CategoryListItem from "./CategoryListItem"; // adjust path if needed

const avatarPool = ["🐱", "🧑‍💻", "🐼", "🦊", "🐯", "👾", "🐸", "🐨", "🐵", "🐻"];
const getRandomAvatar = () =>
  avatarPool[Math.floor(Math.random() * avatarPool.length)];

const leaderboard = [
  {
    id: 1,
    name: "Yoichi",
    points: 1200,
    avatar: getRandomAvatar()
  },
  {
    id: 2,
    name: "Binka",
    points: 980,
    avatar: getRandomAvatar()
  },
  {
    id: 3,
    name: "Alex",
    points: 850,
    avatar: getRandomAvatar()
  }
];

export default function LeaderboardCategory() {
  return (
    <div>
      {leaderboard.map((item, index) => (
        <CategoryListItem key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}