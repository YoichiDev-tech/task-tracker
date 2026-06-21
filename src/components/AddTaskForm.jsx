export default function AddTaskForm({ onAdd }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value.trim();
    if (title) {
      onAdd(title);
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input type="text" name="title" placeholder="Add a new task" />
      <button type="submit">Add</button>
    </form>
  );
}