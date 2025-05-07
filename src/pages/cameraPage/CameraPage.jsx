import React, { useState, useRef, useEffect } from "react";
import styles from "./cameraPage.module.css";
import { useNavigate, Link } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import logo from "./../../assets/header/logo.png";
import { useMediaQuery } from "react-responsive";

export default function CameraPage({ setCapturedVideo }) {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [shouldRotate, setShouldRotate] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const isMobile = useMediaQuery({ query: "(max-width:1024px)" });

  const verticalVideoConstraints = {
    width: { min: 480, max: 480 },
    height: { min: 720, max: 720 },
  };
  const verticalConstraints = {
    audio: false,
    video: {
      width: { min: 480, max: 480 },
      height: { min: 720, max: 720 },
      facingMode: "user",
    },
  };

  const toastOptions = {
    position: "top-left",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      setVideoBlob(blob);
      setPreviewUrl(url);
      chunksRef.current = [];
    };
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia(verticalConstraints)
      .then((stream) => {
        const mimeType = MediaRecorder.isTypeSupported("video/mp4")
          ? "video/mp4"
          : "video/webm";

        const options = {
          videoBitsPerSecond: 2500000,
          mimeType,
        };

        try {
          mediaRecorderRef.current = new MediaRecorder(stream, options);
          mediaRecorderRef.current.start();

          mediaRecorderRef.current.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
          };

          setTimeout(() => {
            stopRecording();
          }, 4000);
        } catch (error) {
          console.error("Error creating MediaRecorder:", error);
          toast.error(`Recording failed: ${error.message}`, toastOptions);
        }
      })
      .catch((err) => {
        console.error("Webcam Error:", err.name, err.message);
        toast.error(`Camera error: ${err.name} - ${err.message}`, toastOptions);
      });
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setVideoBlob(null);
    setShouldRotate(false);
  };

  const handleSubmit = () => {
    if (videoBlob) {
      setCapturedVideo(videoBlob);
      navigate("/share");
    } else {
      toast.error("Please capture your video", toastOptions);
    }
  };

  const onVideoLoad = (e) => {
    const video = e.target;
    const { videoWidth, videoHeight } = video;
    console.log("Actual resolution:", videoWidth, "x", videoHeight);

    // If video is wider than tall, rotate it for portrait display
    setShouldRotate(videoWidth > videoHeight);
  };

  return (
    <div className={`flex-col-center ${styles.CameraPage}`}>
      <h1>{previewUrl ? "DO YOU LIKE THIS ?" : "READY TO RECORD ?"}</h1>

      <main className={`flex-row-center ${styles.main}`}>
        <div className={`flex-row-center ${styles.webcamParent}`}>
          {!previewUrl && (
            <Webcam
              playsInline
              onResize={onVideoLoad}
              id={styles.webcam}
              forceScreenshotSourceSize={true}
              videoConstraints={verticalVideoConstraints}
              mirrored={true}
            />
          )}
          {previewUrl && (
            <video
              controls
              autoPlay
              className={styles.capturedVideo}
              onLoadedMetadata={onVideoLoad}
              style={{
                transform: shouldRotate ? "rotate(90deg)" : "none",
                transformOrigin: "center center",
                width: shouldRotate ? "100vh" : "100%",
                height: shouldRotate ? "100vw" : "auto",
              }}
              onError={(e) => console.error("Video playback error:", e)}
            >
              <source src={previewUrl} type="video/mp4" />
            </video>
          )}
        </div>
      </main>

      <footer className={`flex-row-center ${styles.footer}`}>
        {!previewUrl && (
          <button onClick={handleStartRecording} className={styles.captureBtn}>
            {isRecording ? (
              <ScaleLoader
                color={"#fff"}
                loading={isRecording}
                height={22}
                width={6}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "CAPTURE"
            )}
          </button>
        )}
        {!isRecording && previewUrl && (
          <div className={`flex-col-center ${styles.btnsContainer}`}>
            <button onClick={handleSubmit} className={styles.captureBtn2}>
              SUBMIT
            </button>
            <button onClick={handleRetake} className={styles.captureBtn2}>
              RETAKE
            </button>
          </div>
        )}
      </footer>

      <Link
        to={"/"}
        className={styles.logoContainer}
        style={{ display: "none" }}
      >
        <img src={logo} alt="logo" />
      </Link>

      <ToastContainer />
    </div>
  );
}
