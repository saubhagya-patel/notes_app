import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { NotesContext } from "../src/context/NotesContext";
import { toast } from "react-toastify";

function Profile() {
  const { user, backendUrl, setUser } = useContext(NotesContext);
  const [institution, setInstitution] = useState("");
  const [semester, setSemester] = useState(1);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (user) {
      setInstitution(user.institution || "");
      setSemester(user.semester || 1);
      setProfilePic(user.profilePic || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        backendUrl + "/api/user/update-profile",
        {
          institution,
          semester,
          profilePic,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Profile updated");
        setUser(response.data.user); // Update local context
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update Error", error);
      toast.error("An error occurred while updating the profile");
    }
  };

  if (!user) return <div className="text-white">Loading user info...</div>;

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-gray-800 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="w-full bg-gray-700 p-2 rounded mt-1 cursor-not-allowed"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full bg-gray-700 p-2 rounded mt-1 cursor-not-allowed"
          />
        </div>

        <div>
          <label>Institution</label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Semester</label>
          <input
            type="number"
            value={semester}
            min={1}
            max={10}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
        </div>

        <div>
          <label>Profile Picture URL</label>
          <input
            type="text"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default Profile;
