import CategoryListItem from "./CategoryListItem";

export default function CategoryList({ entries, sortKey }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <CategoryListItem
          key={entry.userId}
          entry={entry}
          rank={index + 1}
          sortKey={sortKey}
        />
      ))}
    </div>
  );
}