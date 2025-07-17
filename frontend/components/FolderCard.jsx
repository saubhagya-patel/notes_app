import React from "react";
import { Link } from "react-router-dom";

const FolderCard = ({ folder }) => {
  return (
    <Link to={`/folders/${folder._id}`}>
      <div className="p-4 bg-white rounded-2xl shadow border hover:shadow-md transition hover:bg-gray-50">
        <h3 className="text-lg font-semibold">{folder.name}</h3>
        <p className="text-sm text-gray-500">{folder.subject}</p>
      </div>
    </Link>
  );
};

export default FolderCard;
