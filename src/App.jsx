import { useState } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React', status: "todo" },
    { id: 2, title: 'Build a Task Tracker', status: "todo" },
  ]);

  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in-progress");
  const completedTasks = tasks.filter(t => t.status === "completed");


  const handleDelete = (taskId) => {
    console.log(`Delete task with ID: ${taskId}`);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggle = (taskId) => {
    console.log(`Toggle task with ID: ${taskId}`);
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "todo" ? "in-progress" : "completed" } : task
      )
    );
  };

  const handleAdd = (title) => {
    console.log(`Add new task with title: ${title}`);
    const newTask = {
      id: Date.now(),
      title,
      status: "todo"
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="app">
      <h1>Task Tracker</h1>
      <AddTaskForm onAdd={handleAdd} />
      <h2>To Do</h2>
      <TaskList tasks={todoTasks} onDelete={handleDelete} onToggle={handleToggle} />
      <h2>In Progress</h2>
      <TaskList tasks={inProgressTasks} onDelete={handleDelete} onToggle={handleToggle} />
      <h2>Completed</h2>
      <TaskList tasks={completedTasks} onDelete={handleDelete} onToggle={handleToggle} />
    </div>
  );
}