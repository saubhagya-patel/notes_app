// components/UploadNoteModal.jsx
import React, { useState } from "react";
import axios from "axios";

const UploadNoteModal = ({ folderId, backendUrl, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("folderId", folderId);

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/notes/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        onSuccess(res.data.note);
        onClose();
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Note</h2>
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Note title"
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="file"
            className="w-full mb-3"
            accept=".pdf,.png,.jpg,.jpeg,.docx,.pptx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNoteModal;
