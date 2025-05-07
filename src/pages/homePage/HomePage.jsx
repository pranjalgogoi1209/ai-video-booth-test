import React from "react";
import styles from "./homePage.module.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className={`flex-col-center ${styles.HomePage}`}>
      <h1>
        RECORD TO TRANSFORM <br /> INTO YOUR COOL <br /> AI AVATAR HERE
      </h1>
      <Link to={"/gender"} className={styles.startBtn}>
        <button>START NOW</button>
      </Link>
    </div>
  );
}
