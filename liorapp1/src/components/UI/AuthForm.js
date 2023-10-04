import React, { useContext, useRef, useState } from "react";
import styles from "./AuthForm.module.css";
import Backdrop from "./Backdrop";
import Button from "@mui/material/Button";
import { AuthContext } from "../../context/AuthContext";

const AuthForm = () => {
  const authCtx = useContext(AuthContext);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    const password = passwordRef.current.value;
    const username = usernameRef.current.value;
    const responseErr = await authCtx.addUser({ username, password });
    if (responseErr) {
      if (typeof responseErr.message === "string") {
        setErrors(responseErr.message);
      } else if (typeof responseErr.message === "object") {
        setErrors(
          responseErr.message.map((text, index) => <p key={index}>* {text}</p>)
        );
      } else if (typeof responseErr.message === "undefined") {
        setErrors(null);
      }
    }
  };
  return (
    <Backdrop>
      <form className={styles.authForm} onSubmit={submitHandler}>
        <h1>Signup</h1>
        {errors && <div className={styles.errors}>{errors}</div>}
        <div className={styles.credentials}>
          <div className={styles.credBracket}>
            <label>Username: </label>
            <input type="text" ref={usernameRef} />
          </div>
          <div className={`${styles.credBracket} ${styles.passBracket}`}>
            <label>Password: </label>
            <input type="text" ref={passwordRef} />
          </div>
        </div>
        <div className={styles.button}>
          <Button type="submit">{!authCtx.logged ? "Signup" : "Login"}</Button>
        </div>
      </form>
    </Backdrop>
  );
};

export default AuthForm;
