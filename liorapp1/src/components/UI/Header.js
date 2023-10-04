import React, { useContext } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGear,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const info = {
    name: authCtx.user?.username,
    logged: authCtx.logged,
  };
  return (
    <div className={styles.header}>
      <FontAwesomeIcon className={styles.icon} icon={faBars} />
      {!info.logged ? <h1>Lior</h1> : <h1>Hi {info.name}!</h1>}
      <FontAwesomeIcon
        className={styles.icon}
        icon={faRightToBracket}
        onClick={() => authCtx.showWindow(true)}
      />
      <hr />
    </div>
  );
};

export default Header;
