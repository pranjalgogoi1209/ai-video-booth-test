import React, { useState, useEffect } from "react";
import styles from "./sharePage.module.css";
import { storagedb } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

import Email from "../../components/email/Email";
import Loader from "../../components/loader/Loader";

// Toast options
const toastOptions = {
  position: "top-left",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

export default function SharePage({ capturedVideo, gender, resetData }) {
  const [generatedVideo, setGeneratedVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState();
  const [showEmail, setShowEmail] = useState(false);
  const [filename, setFilename] = useState();
  const [selectedOption, setSelectedOption] = useState("");

  // console.log("video url =>", videoUrl);
  // console.log("filename =>", filename);
  // console.log("gender =>", gender);

  // upload video
  useEffect(() => {
    const uploadVideo = async () => {
      try {
        let filename = v4() + ".webm";

        let videoRef = ref(storagedb, `input_videos/${filename}`);
        // console.log("videoRef =>", videoRef);
        await uploadBytes(videoRef, capturedVideo);
        const videoUrl = await getDownloadURL(videoRef);
        console.log(videoUrl);

        setGeneratedVideo(true);
        setVideoUrl(videoUrl);
        setFilename(filename);
      } catch (error) {
        console.log(error);
        setGeneratedVideo(false);
        // setGeneratedVideo(true);
        toast.error(
          `Please check your internet connection, Failed to upload video`,
          toastOptions
        );
      }
    };

    if (capturedVideo) uploadVideo();
  }, [capturedVideo]);

  return (
    <div className={`flex-col-center ${styles.SharePage}`}>
      {generatedVideo ? (
        <h1>THANK YOU</h1>
      ) : (
        <h1>
          GENERATING <br />
          YOUR VIDEO
        </h1>
      )}

      {generatedVideo ? (
        <div className={`flex-col-center ${styles.generatedVideoContainer}`}>
          <h1>
            PLEASE ENTER <br /> DETAILS
          </h1>

          <div className={`flex-col-center ${styles.btnContainer}`}>
            <button
              onClick={() => {
                setSelectedOption("whatsapp");
                setShowEmail(true);
              }}
            >
              WHATSAPP
            </button>
            <button
              onClick={() => {
                setSelectedOption("email");
                setShowEmail(true);
              }}
            >
              EMAIL
            </button>
          </div>
        </div>
      ) : (
        <Loader />
      )}

      {/* email */}
      {showEmail && (
        <Email
          setShowEmail={setShowEmail}
          videoUrl={videoUrl}
          filename={filename}
          gender={gender}
          resetData={resetData}
          selectedOption={selectedOption}
        />
      )}
      <ToastContainer />
    </div>
  );
}
