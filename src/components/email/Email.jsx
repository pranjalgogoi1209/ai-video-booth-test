import React, { useState, CSSProperties } from "react";
import styles from "./email.module.css";

import ScaleLoader from "react-spinners/ScaleLoader";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import close from "./../../assets/close.svg";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function Email({
  setShowEmail,
  videoUrl,
  filename,
  gender,
  resetData,
  selectedOption,
}) {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  let [loading, setLoading] = useState(false);

  // handle change
  const handleChange = (e) => {
    if (e.target.name === "whatsapp") {
      // value should not be less than or more than 10 digits
      if (e.target.value.length > 10) {
        setError("Number should not be more than 10 digits");
        return;
      }
      setWhatsappNumber(e.target.value);
    }
    setError("");
    setUserEmail(e.target.value);
  };

  // toast options
  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // send email to firebase
  const sendEmail = async () => {
    try {
      // timestamp
      const timestamp = Date.now();

      const valueRef = collection(db, "input_videos");

      const data = {
        filename: filename,
        url: videoUrl,
        gender: gender,
        timestamp: timestamp,
      };

      if (selectedOption === "whatsapp") {
        data.whatsappNumber = whatsappNumber;
        data.email = "";
      } else {
        data.email = userEmail;
        data.whatsappNumber = "";
      }

      const result = await addDoc(valueRef, data);

      if (selectedOption === "whatsapp") {
        toast.success(
          "Success! Your video has been sent via WhatsApp.",
          toastOptions
        );
      } else {
        toast.success(
          "📩 Success! Your video has been sent to your email",
          toastOptions
        );
      }
      setTimeout(() => {
        // data reset
        resetData();
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(
        "Something went wrong. Please try again later. 🙏",
        toastOptions
      );
    }
  };

  // handle submit
  const handleSubmit = () => {
    if (!loading) {
      if (userEmail) {
        if (userEmail.length < 10) {
          setError("Number should not be less than 10 digits");
          return;
        }
        setLoading(true);
        sendEmail();
      } else {
        toast.error("Please enter a correct email", toastOptions);
      }
    } else {
      toast.error("Please wait...", toastOptions);
    }
  };

  return (
    <div
      className={`flex-row-center ${styles.Email}`}
      onClick={() => setShowEmail(false)}
    >
      <div
        className={`flex-col-center ${styles.container}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={`flex-col-center ${styles.inputContainer}`}>
          {/* email */}
          {selectedOption === "email" && (
            <input
              name="email"
              type="email"
              value={userEmail}
              placeholder="Enter your email"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            />
          )}

          {/* whatsapp */}
          {selectedOption === "whatsapp" && (
            <input
              name="whatsapp"
              type="number"
              value={userEmail}
              placeholder="Enter your whatsapp number"
              onChange={(e) => handleChange(e)}
              className={styles.input}
            />
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button onClick={handleSubmit}>
          {loading ? (
            <ScaleLoader
              color={"#fff"}
              loading={loading}
              height={22}
              width={6}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            "SUBMIT"
          )}
        </button>

        <div className={styles.close} onClick={() => setShowEmail(false)}>
          <img src={close} alt="close" />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
