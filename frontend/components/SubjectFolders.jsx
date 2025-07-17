// components/SubjectFolders.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NotesContext } from "../src/context/NotesContext";
import FolderCard from "./FolderCard";

const SubjectFolders = () => {
  const { user, backendUrl, loadingUser } = useContext(NotesContext);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || loadingUser) return;

    const fetchFolders = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/folders/subject", {
          withCredentials: true,
        });

        if (res.data.success) {
          setFolders(res.data.folders);
        } else {
          setError("Failed to load subject folders.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching subject folders.");
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [user, loadingUser]);

  if (loadingUser || loadingFolders) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">📚 Subject Folders</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : folders.length === 0 ? (
        <p className="text-gray-500">No subject folders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {folders.map((folder) => (
            <FolderCard key={folder._id} folder={folder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectFolders;
