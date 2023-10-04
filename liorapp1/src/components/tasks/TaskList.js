import React, { useContext } from "react";
import TaskItem from "./TaskItem";
import styles from "./TaskList.module.css";
import { TaskContext } from "../../context/TaskContext";

const TaskList = () => {
  const taskCtx = useContext(TaskContext);
  const taskList = taskCtx.tasks.map((task) => (
    <TaskItem
      key={task.id}
      id={task.id}
      title={task.title}
      description={task.description}
      status={task.status}
    />
  ));
  return (
    <React.Fragment>
      <div className={styles.taskList}>{taskList}</div>
    </React.Fragment>
  );
};

export default TaskList;

export const loader = async () => {
  try {
    const response = await fetch("http://localhost:8080/tasks");
    if (!response.ok) {
      throw new Error((await response).statusText);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
