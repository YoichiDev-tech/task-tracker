export type Task = {
    id: number;
    title: string;
    status: "todo" | "in-progress" | "completed";
    createdAt: string;
    completedAt?: string;
};