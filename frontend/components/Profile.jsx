import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { NotesContext } from "../src/context/NotesContext";
import { toast } from "react-toastify";
import config from "../src/config/config";
import Tags from "@yaireo/tagify/dist/react.tagify"; // ✅ correct way to import the React wrapper
import "@yaireo/tagify/dist/tagify.css"; // ✅ import Tagify styles


function Profile() {
  const { user, backendUrl, setUser } = useContext(NotesContext);
  const [institution, setInstitution] = useState("");
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([]);

  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);
  const [originalProfilePic, setOriginalProfilePic] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const predefinedSubjects = ["DBMS","Operating Systems","Data Structures","Machine Learning","Computer Networks","Web Development","OOP","AI","Software Engineering",];

  useEffect(() => {
    if (user) {
      setInstitution(user.institution || "");
      setSemester(user.semester || 1);
      setProfilePic(user.profilePicture || "");
      setOriginalProfilePic(user.profilePicture || ""); // store original
      setSubjects(user.subjects || []);
    }
  }, [user]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setProfilePic(URL.createObjectURL(file)); // local preview only
    }
  };
  const handleSubjectsChange = (e) => {
    try {
      const value = e.detail.value;
      if (!value) {
        setSubjects([]);
        return;
      }
      const parsed = JSON.parse(value);
      setSubjects(parsed.map((tag) => tag.value));
    } catch (err) {
      console.error("Error parsing Tagify data", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = profilePic;

    try {
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("file", selectedImageFile);
        formData.append("upload_preset", config.UPLOAD_PRESET);
        formData.append("cloud_name", config.CLOUD_NAME);

        const res = await axios.post("https://api.cloudinary.com/v1_1/" + config.CLOUD_NAME + "/image/upload", formData);
        imageUrl = res.data.secure_url;
      }

      const response = await axios.put(
        backendUrl + "/api/user/update-profile",
        {
          institution,
          semester,
          profilePic: imageUrl,
          subjects
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Profile updated");
        setUser(response.data.user);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update Error", error);
      toast.error("An error occurred while updating the profile");
    } finally {
      setUploading(false);
    }
  };


  if (!user) return <div className="text-white">Loading user info...</div>;

  return (
    <div className=" mx-auto p-6 mt-10 bg-gray-800 text-white rounded-xl shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2> */}
      <form onSubmit={handleUpdate} className="row flex flex-row gap-10 flex-wrap">
        <div className="flex flex-col items-center gap-4 w-full sm:w-1/3" >
          <img
            src={profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm bg-gray-700 file:text-white file:bg-blue-600 file:border-none file:px-4 file:py-2 file:rounded file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
          {profilePic !== originalProfilePic && (
            <button
              type="button"
              onClick={() => {
                setProfilePic(originalProfilePic);
                setSelectedImageFile(null); // remove new image file
              }}
              className="mt-2 text-sm text-red-400 hover:text-red-600"
            >
              Undo Image Change
            </button>
          )}
        </div>
        <div className="flex-1">
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
            <label>Subjects</label>
            <Tags
              whitelist={predefinedSubjects}
              mode="select" // makes suggestions visible
              className="color-white"
              placeholder="Add subjects"
              dropdown={{
                enabled: 1, // show suggestions after 1 character
                fuzzySearch: true,
                position: "all",
                highlightFirst: true,
              }}
              value={subjects.map((subj) => ({ value: subj }))}
              onChange={handleSubjectsChange}
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
