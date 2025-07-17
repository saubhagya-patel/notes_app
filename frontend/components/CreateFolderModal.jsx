import React, { useState, useContext } from "react";
import axios from "axios";
import { NotesContext } from "../src/context/NotesContext";

const CreateFolderModal = ({ onClose, onFolderCreated, parentFolderId = null }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(NotesContext);

  const handleCreate = async () => {
    if (!name || !subject) return;

    setLoading(true);
    try {
      const payload = {
        name,
        subject,
        isCoreFolder: false,
      };

      if (parentFolderId) {
        payload.parentFolderId = parentFolderId;
      }

      const res = await axios.post(`${backendUrl}/api/folders`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        onFolderCreated(); // notify parent to refresh
      }
    } catch (err) {
      console.error("Error creating folder", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
        <h3 className="text-xl font-semibold mb-4">
          {parentFolderId ? "Create Subfolder" : "Create Folder"}
        </h3>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Folder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
