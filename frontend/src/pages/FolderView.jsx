import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import NoteCard from "../../components/NoteCard";
import UploadNoteButton from "../../components/UploadNotesButton";
import FolderCard from "../../components/FolderCard";
import CreateFolderModal from "../../components/CreateFolderModal";
import { NotesContext } from "../context/NotesContext";

const FolderView = () => {
  const { folderId } = useParams();
  const { backendUrl, user } = useContext(NotesContext);

  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubfolderModal, setShowSubfolderModal] = useState(false);

  const fetchFolder = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/folders/${folderId}`, {
        withCredentials: true,
      });
      if (res.data.success) setFolder(res.data.folder);
      else setError("Folder not found.");
    } catch (err) {
      console.error(err);
      setError("Error fetching folder.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolder();
  }, [folderId]);
  console.log(folderId)

  const handleNoteUploaded = (newNote) => {
    setFolder((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
  };

  const handleSubfolderCreated = () => {
    setShowSubfolderModal(false);
    fetchFolder(); // refresh subfolders
  };

  if (loading) return <p className="text-gray-400">Loading folder...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{folder.name}</h2>
          <p className="text-gray-400">{folder.description || "No description"}</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
          onClick={() => setShowSubfolderModal(true)}
        >
          + Create Subfolder
        </button>
      </div>

      {/* Subfolders Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">📁 Subfolders</h3>
        {folder.subfolders?.length === 0 ? (
          <p className="text-gray-500">No subfolders in this folder.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {folder.subfolders.map((subfolder) => (
              <FolderCard key={subfolder._id} folder={subfolder} />
            ))}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <UploadNoteButton
        userId={user._id}
        folder={folder}
        backendUrl={backendUrl}
        onNoteUploaded={handleNoteUploaded}
      />
      <h3 className="text-xl font-semibold text-white mb-2 mt-6">📝 Notes</h3>
      {folder.notes.length === 0 ? (
        <p className="text-gray-500">No notes yet in this folder.</p>
      ) : (
        <div className="space-y-3">
          {folder.notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}

      {/* Modal */}
      {showSubfolderModal && (
        <CreateFolderModal
          onClose={() => setShowSubfolderModal(false)}
          onFolderCreated={handleSubfolderCreated}
          parentFolderId={folderId} // 👈 tell modal to create subfolder
        />
      )}
    </div>
  );
};

export default FolderView;
