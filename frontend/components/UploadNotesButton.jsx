// components/UploadNoteButton.jsx
import React, { useState } from "react";
import UploadNoteModal from "./UploadNoteModal";

const UploadNoteButton = ({ userId, folder, backendUrl, onNoteUploaded }) => {
  const [showModal, setShowModal] = useState(false);

  const isOwner = folder.owner?._id === userId;
  const isPrivate = folder.isPrivate !== false;

  if (!isOwner || !isPrivate) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Upload Note
      </button>

      {showModal && (
        <UploadNoteModal
          folderId={folder._id}
          backendUrl={backendUrl}
          onClose={() => setShowModal(false)}
          onSuccess={onNoteUploaded}
        />
      )}
    </div>
  );
};

export default UploadNoteButton;
