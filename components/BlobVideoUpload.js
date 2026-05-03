"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";

export default function BlobVideoUpload() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("");
  const [blobUrl, setBlobUrl] = useState("");
  const [progress, setProgress] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();

    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setStatus("Uploading...");
    setBlobUrl("");
    setProgress(0);

    try {
      const blob = await upload(`videos/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        multipart: true,
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.round(percentage));
        }
      });

      setBlobUrl(blob.url);
      const videoUrlInput = document.querySelector('input[name="video_url"]');
      if (videoUrlInput) {
        videoUrlInput.value = blob.url;
        videoUrlInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
      setStatus("Upload complete. Video File URL filled in below.");
    } catch (error) {
      setStatus(error.message || "Upload failed.");
    }
  }

  return (
    <div className="form_box">
      <strong>Upload video to Vercel Blob</strong>

      <form onSubmit={handleSubmit}>
        <label>Video File</label>
        <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" required />
        <button className="era-button" type="submit">Upload to Blob</button>
      </form>

      {status && (
        <div className="upload_status">
          {status}
          {progress > 0 && progress < 100 && <span> {progress}%</span>}
        </div>
      )}

      {blobUrl && (
        <>
          <label>Uploaded URL</label>
          <textarea className="blob_url_output" readOnly value={blobUrl} />
        </>
      )}
    </div>
  );
}
