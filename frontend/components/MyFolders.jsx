// components/MyFolders.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CreateFolderModal from "./CreateFolderModal";
import { NotesContext } from "../src/context/NotesContext";
import FolderCard from "./FolderCard";

const MyFolders = () => {
  const { user, backendUrl, loadingUser } = useContext(NotesContext); // 👈 use context
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(true);

  const fetchMyFolders = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/folders`, {
        withCredentials: true, // 👈 sends cookie token
      });
      if (res.data.success) {
        setFolders(res.data.folders);
      }
    } catch (err) {
      console.error("Error fetching my folders", err);
    } finally {
      setLoadingFolders(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      fetchMyFolders();
    }
  }, [loadingUser, user]);

  const handleFolderCreated = () => {
    setShowModal(false);
    fetchMyFolders(); // refresh list
  };

  if (loadingUser || loadingFolders) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">🗂 My Notes</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
          onClick={() => setShowModal(true)}
        >
          + Create Folder
        </button>
      </div>

      {folders.length === 0 ? (
        <p className="text-gray-500">You have no personal folders.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <FolderCard key={folder._id} folder={folder} />
          ))}
        </div>
      )}


      {showModal && (
        <CreateFolderModal
          onClose={() => setShowModal(false)}
          onFolderCreated={handleFolderCreated}
        />
      )}
    </div>
  );
};

export default MyFolders;
