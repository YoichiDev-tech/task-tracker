import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title.trim());
    setTitle('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 rounded-lg bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300
                   text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <button
        type="submit"
        className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition"
      >
        <Plus className="h-5 w-5" />
        Add
      </button>
    </form>
  );
}