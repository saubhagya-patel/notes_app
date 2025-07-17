import React from "react";
import { Link } from "react-router-dom";

const NoteCard = ({ note }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow border hover:shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-lg">{note.title}</h4>
          <p className="text-sm text-gray-500">Type: {note.fileType.toUpperCase()}</p>
          <p className="text-xs text-gray-400">
            Uploaded: {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
        <Link
          to={`/view/${note._id}`}
          state={{ note }}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </Link>
      </div>
      <p className="text-sm text-gray-600 mt-2">👍 Votes: {note.vote}</p>
    </div>
  );
};

export default NoteCard;
