import { FormEvent, useRef } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddTaskForm({ onAdd }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const title = inputRef.current?.value.trim() || '';
    if (!title) return;
    onAdd(title);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <form onSubmit={submit} className="mb-6">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a new task..."
          className="input-base"
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </div>
    </form>
  );
}