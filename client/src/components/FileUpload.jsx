import { useRef, useState } from "react";
import { API_URL } from "../config";

const maxFileSize = 10 * 1024 * 1024;
const allowedExtensions = /\.(pdf|png|jpe?g|docx?|xlsx?|csv)$/i;

function FileUpload({ token }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!allowedExtensions.test(selectedFile.name)) {
      setFile(null);
      setMessage("Choose a PDF, image, Word, Excel, or CSV document.");
      setUploadStatus("error");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setFile(null);
      setMessage("This file is larger than 10 MB. Choose a smaller file.");
      setUploadStatus("error");
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setUploadStatus("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    selectFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file before uploading.");
      setUploadStatus("error");
      return;
    }

    setUploading(true);
    setMessage("");
    setUploadStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Upload failed. Please try again.");
      }

      setMessage(data.message || "File uploaded successfully.");
      setUploadStatus("success");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage(
        error.message || "Upload failed. Please check your connection."
      );
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="file-upload">
      <div className="panel-heading">
        <div>
          <span className="panel-eyebrow">DOCUMENT INTAKE</span>
          <h2>Add a supporting document</h2>
          <p className="panel-description">
            Upload a clear, authorised copy to support programme or beneficiary records.
          </p>
        </div>

        <div className="upload-heading-icon" aria-hidden="true">
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M5 15v4h14v-4" />
          </svg>
        </div>
      </div>

      <div
        className={`upload-dropzone ${dragActive ? "drag-active" : ""} ${file ? "has-file" : ""} ${uploading ? "uploading" : ""}`}
        onClick={() => {
          if (!uploading) fileInputRef.current?.click();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!uploading) setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDragActive(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          if (!uploading) {
            const droppedFile = event.dataTransfer.files?.[0];
            selectFile(droppedFile);
          }
        }}
        role="button"
        tabIndex={uploading ? -1 : 0}
        aria-disabled={uploading}
        aria-describedby="upload-file-guidance"
        aria-label="Choose a document or drop it here"
        onKeyDown={(event) => {
          if (!uploading && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="upload-icon" aria-hidden="true">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
          </svg>
        </div>

        <h3>{file ? "Document ready to upload" : "Drop your document here"}</h3>
        <p>{file ? "Review the selected file below before uploading." : "Drag and drop a file, or browse your device."}</p>
        <span className="upload-browse-label">{file ? "Choose a different file" : "Browse files"}</span>

        <input
          ref={fileInputRef}
          type="file"
          className="upload-file-input"
          disabled={uploading}
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.csv"
          onClick={(event) => event.stopPropagation()}
          onChange={handleFileChange}
          aria-label="Choose a supporting document"
        />
      </div>

      {file && (
        <div className="selected-file">
          <div className="selected-file-icon" aria-hidden="true">
            {file.name.split(".").pop()?.toUpperCase().slice(0, 4)}
          </div>

          <div className="selected-file-info">
            <strong>{file.name}</strong>
            <span>{formatFileSize(file.size)}</span>
          </div>

          <button
            type="button"
            className="remove-file-button"
            disabled={uploading}
            onClick={() => {
              setFile(null);
              setMessage("");
              setUploadStatus("");

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            aria-label="Remove selected file"
          >
            ×
          </button>
        </div>
      )}

      <div className="upload-footer">
        <p className="upload-hint" id="upload-file-guidance">
          PDF, image, Word, Excel, or CSV · Up to 10 MB · Only upload files your organisation is authorised to store.
        </p>

        <button
          type="button"
          className="primary-button upload-submit-button"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload document"}
        </button>
      </div>

      {message && (
        <div
          className={`upload-message ${
            uploadStatus === "success" ? "upload-message-success" : ""
          } ${uploadStatus === "error" ? "upload-message-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">
            {uploadStatus === "success" ? "✓" : uploadStatus === "error" ? "!" : ""}
          </span>
          {message}
        </div>
      )}
    </section>
  );
}

export default FileUpload;
