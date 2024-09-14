import Task from "@/interface/task";
import axios from "../lib/axios.config";

export const getTask = async (id: string) => {
  const task = await axios.get<Task>(`/tasks/${id}`);
  return task;
};

export const getTasks = async () => {
  try {
    const tasks = await axios.get<Task[]>("/tasks");
    return tasks;
  } catch (error) {
    console.error(error);
  }
};
