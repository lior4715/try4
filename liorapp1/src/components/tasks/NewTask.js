import React, { useContext, useRef } from "react";
import styles from "./NewTask.module.css";
import { TaskContext } from "../../context/TaskContext";
import { Button } from "@mui/material";
import Backdrop from "../UI/Backdrop";
import { AuthContext } from "../../context/AuthContext";

const NewTask = () => {
  const taskCtx = useContext(TaskContext);
  const titleRef = useRef();
  const descRef = useRef();
  const submitHandler = (e) => {
    e.preventDefault();
    const task = {
      title: titleRef.current.value,
      description: descRef.current.value,
    };
    taskCtx.addTask(task)
  };

  return (
    <Backdrop>
      <form onSubmit={submitHandler} className={styles.taskForm}>
        <h1>Task</h1>
        <div className={styles.titleBracket}>
          <label>Task title</label>
          <input type="text" ref={titleRef} />
        </div>
        <div className={styles.descBracket}>
          <label>Task desc</label>
          <input type="text" ref={descRef} />
        </div>
        <Button className={styles.Button} type="submit">Submit</Button>
      </form>
    </Backdrop>
  );
};

export default NewTask;
