"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@nextui-org/button";
import { getTasks } from "@/api/task";
import { useEffect, useState } from "react";
import Task from "@/interface/task";

export default function page() {
  const [content, setContent] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [oneTask, setOneTask] = useState<Task | null>(null);

  useEffect(() => {
    handleFetchTasks();
  }, []);

  const handleFetchTasks = async () => {
    const data = await getTasks();
    if (!data) {
      console.error("Not found");
    } else {
      const tasks = data.data;
      const tasksList: Task[] = [];
      tasks?.map((task) => {
        tasksList.push(task);
      });
      setContent(tasksList);
      return tasks;
    }
  };

  // const handleOnClick = async () => {
  //   const data = await getTasks();
  //   if (!data) {
  //     return "Cannot Find Data";
  //   }
  //   setContent(data.data);
  //   console.log(content);
  // };

  // const handleOnChange = (event: any) => {
  //   setInputValue(event.target.value);
  // };

  // const handleSubmit = async (event: any) => {
  //   event.preventDefault(); // Prevent form from refreshing the page
  //   const data = await getTask(inputValue);
  //   if (!data) {
  //     return "Cannot Find ID";
  //   } else {
  //     setOneTask(data.data);
  //   }
  // };

  return (
    <div>
      <Table>
        <TableCaption className=" text-cyan-700">List of Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>TITLE</TableHead>
            <TableHead>DESCTIPTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((content) => (
            <TableRow key={content.id}>
              <TableCell>{content.id}</TableCell>
              <TableCell>{content.title}</TableCell>
              <TableCell>{content.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* {content.map((task, index) => {
        return (
          <div key={index}>
            <div>{task.title}</div>
            <div>{task.description}</div>
          </div>
        );
      })}

      <Button className="text-xl" onClick={handleOnClick}>
        Get Task
      </Button>
      <form onSubmit={handleSubmit}>
        <label>Insert Task ID: </label>
        <input type="text" onChange={handleOnChange} className="bg-gray-100" />
        <input type="submit" value="Submit" className="bg-slate-300" />
      </form>

      {oneTask && (
        <div>
          <h3>Task Details</h3>
          <div>Title: {oneTask.title}</div>
          <div>Description: {oneTask.description}</div>
        </div>
      )} */}
    </div>
  );
}
