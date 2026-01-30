// src/components/ImportTradesPopup/ImportTradesPopup.tsx
import React, { useCallback, useState } from "react";
import Styles from "./ImportTradesPopup.module.css";
import axios from "axios";

interface ImportTradesPopupProps {
  onClose: () => void;
}

const ImportTradesPopup: React.FC<ImportTradesPopupProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [comingSoon, setComingSoon] = useState(true);
  if(!comingSoon){  // fooling the react component re-render
    setComingSoon(false);
  }

  // If you want to dynamically change this based on API or feature flag
  // useEffect(() => {
  //   // Check if feature is enabled from API or config
  //   // setComingSoon(false); // Set to false when feature is ready
  // }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a CSV file.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        setError("Please upload a CSV file.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/trades/import/csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (response.data?.success) {
        const imported = response.data.importedCount ?? 0;
        setSuccessMessage(
          imported ? `Imported ${imported} trades successfully.` : "Import completed."
        );
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(response.data?.message || "Failed to import trades.");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Render coming soon popup
  if (comingSoon) {
    return (
      <div className={Styles.backdrop} onClick={handleBackdropClick}>
        <div className={Styles.modal}>
          <div className={Styles.header}>
            <h2 className={Styles.title}>Import trades from CSV</h2>
            <button className={Styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={Styles.comingSoonContainer}>
            <div className={Styles.comingSoonText}>
              🚧 This feature is coming soon! 🚧
            </div>
            <p className={Styles.comingSoonMessage}>
              We're working hard to bring you CSV import functionality. 
              For now, please add trades manually or check back later.
            </p>
          </div>

          <div className={Styles.footer}>
            <button
              className={Styles.cancelButton}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render normal file upload popup
  return (
    <div className={Styles.backdrop} onClick={handleBackdropClick}>
      <div className={Styles.modal}>
        <div className={Styles.header}>
          <h2 className={Styles.title}>Import trades from CSV</h2>
          <button className={Styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          className={`${Styles.dropZone} ${isDragging ? Styles.dropZoneActive : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className={Styles.dropText}>
            Drag & drop your Zerodha CSV file here
          </p>
          <p className={Styles.orText}>or</p>
          <label className={Styles.fileLabel}>
            <span>Browse files</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className={Styles.fileInput}
            />
          </label>
          {file && (
            <p className={Styles.selectedFile}>Selected: {file.name}</p>
          )}
        </div>

        {error && <p className={Styles.error}>{error}</p>}
        {successMessage && <p className={Styles.success}>{successMessage}</p>}

        <div className={Styles.footer}>
          <button
            className={Styles.cancelButton}
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            className={Styles.uploadButton}
            onClick={handleUpload}
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportTradesPopup;