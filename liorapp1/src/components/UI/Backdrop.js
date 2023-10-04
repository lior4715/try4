import React, { useContext, useState } from "react";
import styles from "./Backdrop.module.css";
import { TaskContext } from "../../context/TaskContext";
import { AuthContext } from "../../context/AuthContext";

const Backdrop = (props) => {
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext);
  const [mouseOut, setMouseOut] = useState(true);
  const exitHandler = () => {
    if (mouseOut) {
      taskCtx.toggleWindow(false);
      authCtx.showWindow(false);
    }
  };
  return (
    <div className={styles.backdrop} onClick={exitHandler}>
      <div
        onMouseEnter={() => setMouseOut(false)}
        onMouseLeave={() => setMouseOut(true)}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Backdrop;
