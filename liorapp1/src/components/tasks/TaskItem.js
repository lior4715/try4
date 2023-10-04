import React, { useContext, useRef } from "react";
import styles from "./TaskItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { TaskContext } from "../../context/TaskContext";
import { AuthContext } from "../../context/AuthContext";

const TaskItem = (props) => {
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext)
  const statusRef = useRef();

  const deleteHandler = () => {
    taskCtx.deleteTask(props.id, authCtx.aKey);
  };

  const editStatusHandler = async () => {
    const responseErr = await taskCtx.editTaskStatus(
      props.id,
      statusRef.current.value,
      authCtx.aKey
    );
    if (responseErr) {
      console.log(responseErr);
    }
  };
  const optionsArray = ["IN_PROGRESS", "OPEN", "DONE"];
  const selector = optionsArray.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));
  return (
    <div className={styles.taskItem}>
      <div className={styles.detailsBracket}>
        <div className={styles.title}>Title: {props.title}</div>
        <div className={styles.description}>Desc: {props.description}</div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.status}>
          Status:{" "}
          <select
            defaultValue={props.status}
            onChange={editStatusHandler}
            ref={statusRef}
            disabled={!authCtx.logged}
          >
            {selector}
          </select>
        </div>
        <FontAwesomeIcon
          className={styles.icon}
          icon={faTrash}
          onClick={deleteHandler}
        />
      </div>
    </div>
  );
};

export default TaskItem;
