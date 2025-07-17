// pages/userHome.jsx
import React from "react";
import { SubjectFolders, MyFolders } from "../../components";

const UserHome = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <SubjectFolders />
      <MyFolders />
    </div>
  );
};

export default UserHome;
