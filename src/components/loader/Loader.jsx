import React, { useEffect, useState } from "react";
import styles from "./loader.module.css";

export default function Loader() {
  const [lineArr, setLineArr] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineArr((prevLineArr) => [...prevLineArr, prevLineArr.length + 1]);
    }, 400);

    // Stop the interval after 20 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 14000);

    // Clean up the interval and timeout on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <span className={`flex-row-center ${styles.Loader}`}>
      {lineArr.map((item, index) => (
        <div className={styles.line} key={index}></div>
      ))}
    </span>
  );
}
