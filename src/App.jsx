import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { IoMdHome } from "react-icons/io";

import Header from "./components/header/Header";
import { HomePage, CameraPage, SharePage, GenderPage } from "./pages";

export default function App() {
  const [capturedVideo, setCapturedVideo] = useState();
  const [gender, setGender] = useState();

  // reset data
  const resetData = () => {
    setCapturedVideo(null);
    setGender(null);
  };
  

  return (
    <BrowserRouter>
      <Header />

      <span
        className="homeIcon"
        onClick={() => {
          resetData();
          window.location.href = "/";
        }}
      >
        <IoMdHome />
      </span>

      <Routes>
        {/* home page */}
        <Route path="/" element={<HomePage />} />

        {/* gender page */}
        <Route path="/gender" element={<GenderPage setGender={setGender} />} />

        {/* camera page */}
        <Route
          path="/camera"
          element={<CameraPage setCapturedVideo={setCapturedVideo} />}
        />

        {/* share page */}
        <Route
          path="/share"
          element={
            <SharePage
              capturedVideo={capturedVideo}
              gender={gender}
              resetData={resetData}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
