import React, { useState, useRef } from "react";
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

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const isMobile = useMediaQuery({ query: "(max-width:1024px)" });

  // Video constraints with basic configuration to support Safari
  /* const videoConstraints = {
    width: 736,
    height: 480,
    facingMode: "user",
  }; */

  /* const videoConstraints = {
    width: isMobile ? { exact: 480 } : { exact: 736 },
    height: isMobile ? { exact: 736 } : { exact: 480 },
    aspectRatio: isMobile ? 480 / 736 : 736 / 480,
    facingMode: "user",
  }; */

  /*  const constraints = {
    audio: false,
    video: {
      width: { min: 736, max: 736 },
      height: { min: 480, max: 480 },
    },
  }; */

  /*  const constraints = {
    audio: false,
    video: {
      width: isMobile ? { exact: 480 } : { exact: 736 },
      height: isMobile ? { exact: 736 } : { exact: 480 },
      facingMode: "user",
    },
  }; */

  const videoConstraints = {
    width: isMobile ? { min: 480, max: 480 } : { min: 720, max: 720 },
    height: isMobile ? { min: 720, max: 720 } : { min: 480, max: 480 },
    aspectRatio: 720 / 480,
    facingMode: "user",
  };

  const constraints = {
    audio: false,
    video: {
      width: isMobile ? { min: 480, max: 480 } : { min: 720, max: 720 },
      height: isMobile ? { min: 720, max: 720 } : { min: 480, max: 480 },
      facingMode: "user",
    },
  };

  const tabletVideoConstraints = {
    width: isMobile ? { min: 720, max: 720 } : { min: 480, max: 480 },
    height: isMobile ? { min: 480, max: 480 } : { min: 720, max: 720 },
    aspectRatio: 480 / 720,
    facingMode: "user",
  };

  const forTabletConstraints = {
    audio: false,
    video: {
      width: isMobile ? { min: 720, max: 720 } : { min: 720, max: 720 },
      height: isMobile ? { min: 480, max: 480 } : { min: 480, max: 480 },
      facingMode: "user",
    },
  };

  // horiozntal webcam but need vertical video
  const verticalVideoConstraints = {
    width: 480,
    height: 720,
    facingMode: "user",
  };
  const verticalConstraints = {
    audio: false,
    video: {
      height: { min: 720, max: 720 },
      width: { min: 480, max: 480 },
      facingMode: "user",
    },
  };

  /* navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    const track = stream.getVideoTracks()[0];
    console.log("Supported settings:", track.getCapabilities());
  }); */

  // Simplified options to avoid Safari compatibility issues
  /*   const options = {
    videoBitsPerSecond: 2500000,
    mimeType: "video/webm",
  }; */

  // Stop recording and save the video
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

  // Handle start recording
  const handleStartRecording = () => {
    setIsRecording(true);
    // navigator.mediaDevices
    //   .getUserMedia(constraints)
    //   .then((stream) => {
    //     mediaRecorderRef.current = new MediaRecorder(stream, options);
    //     mediaRecorderRef.current.start();
    //     mediaRecorderRef.current.ondataavailable = (e) => {
    //       chunksRef.current.push(e.data);
    //     };
    //     setTimeout(() => {
    //       stopRecording();
    //     }, 4000);
    //   })
    //   .catch((err) => {
    //     /*   console.error("Error accessing webcam: ", err);
    //     toast.error(
    //       "Failed to access webcam. Please check your camera permissions.",
    //       toastOptions
    //     ); */
    //     console.error("Error accessing webcam:", err.name, err.message);
    //     toast.error(`Camera error: ${err.name} - ${err.message}`, toastOptions);
    //   });
    navigator.mediaDevices
      .getUserMedia(verticalConstraints)
      .then((stream) => {
        const mimeType = MediaRecorder.isTypeSupported("video/mp4")
          ? "video/mp4"
          : "video/webm";

        const options = {
          videoBitsPerSecond: 2500000,
          // videoBitsPerSecond: 2000000,
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

  // Handle retake
  const handleRetake = () => {
    setPreviewUrl(null);
    setVideoBlob(null);
  };

  // Toast options
  const toastOptions = {
    position: "top-left",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  // Handle submit
  const handleSubmit = () => {
    if (videoBlob) {
      setCapturedVideo(videoBlob);
      navigate("/share");
    } else {
      toast.error("Please capture your video", toastOptions);
    }
  };

  // Handle video load to check orientation (optional, can customize as needed)
  const onVideoLoad = (e) => {
    const video = e.target;
    console.log("Actual resolution:", video.videoWidth, "x", video.videoHeight);

    /*  if (video.videoWidth < video.videoHeight) {
      alert("Please rotate your device for best experience!");
    } */
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

      {/* logo */}
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
