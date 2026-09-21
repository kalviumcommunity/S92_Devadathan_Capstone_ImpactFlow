import { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("File uploaded successfully.");
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>
        Upload
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpload;