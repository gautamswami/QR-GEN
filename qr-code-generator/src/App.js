import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";

function App() {
  const [url, setUrl] = useState("");
  const [qrCodes, setQrCodes] = useState([]);
  const [size, setSize] = useState(100); // State for QR code size
  const qrRef = useRef(null);

  // Retrieve QR codes from localStorage on component mount
  useEffect(() => {
    const savedQrCodes = JSON.parse(localStorage.getItem("qrCodes")) || [];
    setQrCodes(savedQrCodes);
  }, []);
 

  const handleGenerate = () => {
    if (url.trim()) {
      const newQRCode = { id: Date.now(), url, size }; // Store size with QR code data
      const updatedQrCodes = [...qrCodes, newQRCode];
      setQrCodes(updatedQrCodes);
      setUrl(""); // Clear input after generating
      localStorage.setItem("qrCodes", JSON.stringify(updatedQrCodes));
    }
  };

  const handleCancel = () => {
    setUrl("");
  };

  const handleDownload = (id) => {
    const node = document.getElementById(`qr-code-${id}`);
    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `qr-code-${id}.png`;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to download image", err);
      });
  };

  const handleRemove = (id) => {
    const updatedQrCodes = qrCodes.filter((qrCode) => qrCode.id !== id);
    setQrCodes(updatedQrCodes); // Update state
    localStorage.setItem("qrCodes", JSON.stringify(updatedQrCodes));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>QR Code Generator</h2>
      <input
        type="text"
        placeholder="Paste your URL here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />

      {/* Slider for QR Code size */}
      <div style={styles.sliderContainer}>
        <label style={styles.sliderLabel}>
          QR size: {size}*{size} px
        </label>
        <input
          type="range"
          min="200"
          max="750"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={styles.slider}
        />
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={handleCancel} style={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={handleGenerate} style={styles.generateButton}>
          Generate
        </button>
      </div>

      <h3 style={styles.subTitle}>Previously Created QR Codes</h3>
      <div style={styles.qrGrid}>
        {qrCodes.map((qrCode) => (
          <div key={qrCode.id} style={styles.qrPlaceholder}>
            <div
              id={`qr-code-${qrCode.id}`}
              ref={qrRef}
              style={styles.qrCodeContainer}
            >
              <QRCode value={qrCode.url} size={qrCode.size} />
            </div>
            <button
              onClick={() => handleDownload(qrCode.id)}
              style={styles.downloadButton}
            >
              Download
            </button>
            <button
              onClick={() => handleRemove(qrCode.id)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    minWidth: "300px",
    width: "fit-content",
    margin: "auto",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    width: "94%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },
  sliderContainer: {
    marginBottom: "20px",
  },
  sliderLabel: {
    fontSize: "14px",
    marginBottom: "10px",
    display: "block",
  },
  slider: {
    width: "100%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "48%",
  },
  generateButton: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "48%",
  },
  subTitle: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  qrGrid: {
    display: "flex",
    gap: "10px",
    maxWidth: "90vw",
    overflow: "scroll",
    flexWrap: "wrap",
  },
  qrPlaceholder: {
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    height: "fit-content",
    borderRadius: "5px",
  },
  qrCodeContainer: {
    marginBottom: "10px",
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  removeButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "5px",
  },
};

export default App;
