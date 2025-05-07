import React from "react";
import styles from "./header.module.css";
import { useLocation } from "react-router-dom";

import logo from "./../../assets/header/logo.png";

export default function Header() {
  const location = useLocation();

  // console.log(location.pathname);

  return (
    <div className={`flex-row-center ${styles.Header}`}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
}
