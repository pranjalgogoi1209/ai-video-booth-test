import React from "react";
import styles from "./genderPage.module.css";
import { useNavigate } from "react-router-dom";

export default function GenderPage({ setGender }) {
  const navigate = useNavigate();

  return (
    <div className={`flex-col-center ${styles.GenderPage}`}>
      <h1>
        PLEASE SELECT <br />
        YOUR GENDER
      </h1>

      <div className={`flex-col-center ${styles.btnContainer}`}>
        <button
          onClick={() => {
            setGender("male");
            navigate("/camera");
          }}
        >
          MALE
        </button>

        <button
          onClick={() => {
            setGender("female");
            navigate("/camera");
          }}
        >
          FEMALE
        </button>
      </div>
    </div>
  );
}
