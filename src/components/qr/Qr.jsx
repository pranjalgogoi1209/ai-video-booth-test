import React from "react";
import styles from "./qr.module.css";

import QRCode from "react-qr-code";
import { IoIosCloseCircle } from "react-icons/io";

export default function Qr({ url, setShowQr }) {
  return (
    <div className={styles.Qr} onClick={() => setShowQr(false)}>
      <div
        className={styles.container}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <h2 className={`gothamBlack ${styles.heading}`}>SCAN, SAVE, SHARE !</h2>
        <QRCode size={150} value={url} className={styles.qrCode} />

        {/* close */}
        <div className={styles.close} onClick={() => setShowQr(false)}>
          <IoIosCloseCircle />
        </div>
      </div>
    </div>
  );
}
