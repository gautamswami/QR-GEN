import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import "./app.css"; // Import global CSS
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
function App() {
  // Load theme and QR codes from localStorage on initialization
  const loadQrCodes = () => JSON.parse(localStorage.getItem("qrCodes")) || [];
  const loadTheme = () => localStorage.getItem("theme") || "light";

  const [url, setUrl] = useState("");
  const [qrCodes, setQrCodes] = useState(loadQrCodes()); // Initialize with loaded QR codes
  const [size, setSize] = useState(100); // State for QR code size
  const [theme, setTheme] = useState(loadTheme()); // Initialize with stored theme
  const qrRef = useRef(null);

  // Effect to apply the selected theme
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : ""; // Apply the theme class to the body
    localStorage.setItem("theme", theme); // Save the theme to localStorage
  }, [theme]);

  const handleGenerate = () => {
    if (url.trim()) {
      const newQRCode = { id: Date.now(), url, size }; // Store size with QR code data
      const updatedQrCodes = [...qrCodes, newQRCode];
      setQrCodes(updatedQrCodes);
      localStorage.setItem("qrCodes", JSON.stringify(updatedQrCodes)); // Save to localStorage
      setUrl(""); // Clear input after generating
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
    setQrCodes(updatedQrCodes);
    localStorage.setItem("qrCodes", JSON.stringify(updatedQrCodes)); // Update localStorage
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div style={styles.container}>
      <div style={styles.headContainer}>
        <h2 style={styles.titleMain}>QR Code Generator</h2>

        {/* Theme toggle button */}
        <button onClick={toggleTheme} style={styles.toggleButton}>
          {theme === "light" ? <CiLight /> : <CiDark />}
        </button>
      </div>
      {/* Input field for URL */}

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
      {qrCodes.length > 0 && (
      <h3 style={styles.subTitle}>Previously Created QR Codes</h3>
      )}
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
    marginTop: "5%",
  },
  headContainer: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px",
  },
  titleMain: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    width: "90%",
  },
  toggleButton: {
    backgroundColor: "var(--button-background-color)",
    color: "var(--button-text-color)",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "30px",
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
    backgroundColor: "var(--button-secondary-background-color)",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "var(--button-secondary-text-color)",
    width: "48%",
  },
  generateButton: {
    backgroundColor: "var(--button-background-color)",
    color: "var(--button-text-color)",
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
