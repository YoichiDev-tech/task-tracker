export default function CategoryListItem({ item, index }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{item.avatar}</span>

      <div>
        <p className="font-semibold text-white light:text-slate-900">
          {item.name}
        </p>
        <p className="text-xs text-slate-400">{item.points} pts</p>
      </div>
    </div>
  );
}