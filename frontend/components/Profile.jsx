import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";
import { toast } from "react-toastify";
import { NotesContext } from "../src/context/NotesContext";
import config from "../src/config/config";

// Helper component for form field errors
const FormError = ({ message }) => {
  if (!message) return null;
  return <p className="text-red-400 text-xs mt-1">{message}</p>;
};

// Custom styles to make Tagify match the dark theme
const tagifyCustomStyles = `
  .tagify {
    --tags-bg: #4A5568;
    --tags-text-color: #E2E8F0;
    --tag-bg: #2D3748;
    --tag-hover: #4A5568;
    --tag-text-color: #E2E8F0;
    --tags-border-color: #4A5568;
    --tag-remove-btn-color: #A0AEC0;
    --tag-pad: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    padding: 0.5rem;
  }
  .tagify__input {
    color: #E2E8F0;
  }
  .tagify__dropdown {
    background: #2D3748;
    border-color: #4A5568;
  }
  .tagify__dropdown__item--active {
    background: #4299E1;
  }
  .tagify__dropdown__item {
    color: #E2E8F0;
  }
`;

function Profile() {
  const { user, backendUrl, setUser } = useContext(NotesContext);

  // Form state
  const [institution, setInstitution] = useState("");
  const [semester, setSemester] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // UI/UX state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalProfilePic, setOriginalProfilePic] = useState("");

  const predefinedSubjects = [
    "DBMS", "Operating Systems", "Data Structures", "Machine Learning",
    "Computer Networks", "Web Development", "OOP", "AI", "Software Engineering",
  ];

  // Effect to populate form with user data
  useEffect(() => {
    if (user) {
      setInstitution(user.institution || "");
      setSemester(user.semester || 1);
      setProfilePic(user.profilePicture || "");
      setOriginalProfilePic(user.profilePicture || "");
      setSubjects(user.subjects || []);
    }
  }, [user]);

  // --- Handlers ---

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation: Check file size (e.g., 2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size should not exceed 2MB");
      return;
    }

    setSelectedImageFile(file);
    setProfilePic(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, profilePic: null }));
  };

  const handleSubjectsChange = (e) => {
    try {
      const value = e.detail.value;
      const parsed = value ? JSON.parse(value) : [];
      setSubjects(parsed.map((tag) => tag.value));
    } catch (err) {
      console.error("Error parsing Tagify data", err);
    }
  };

  // --- Form Validation ---
  const validateForm = () => {
    const newErrors = {};
    if (!institution.trim()) {
      newErrors.institution = "Institution name is required.";
    }
    if (!semester || semester < 1 || semester > 10) {
      newErrors.semester = "Semester must be between 1 and 10.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warn("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    let imageUrl = profilePic;

    try {
      // Step 1: Upload image to Cloudinary if a new one is selected
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("file", selectedImageFile);
        formData.append("upload_preset", config.UPLOAD_PRESET);
        formData.append("cloud_name", config.CLOUD_NAME);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${config.CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = res.data.secure_url;
      }

      // Step 2: Update user profile on your backend
      const response = await axios.put(
        `${backendUrl}/api/user/update-profile`,
        { institution, semester, profilePic: imageUrl, subjects },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setUser(response.data.user);
        setOriginalProfilePic(response.data.user.profilePicture);
        setSelectedImageFile(null);
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update Error", error);
      const errorMessage = error.response?.data?.message || "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center text-white p-10">Loading user info...</div>;
  }

  return (
    <>
      <style>{tagifyCustomStyles}</style>
      <div className="p-4 sm:p-6 lg:p-8 mt-10 bg-gray-800 text-white rounded-xl shadow-2xl">
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* --- Profile Picture Section --- */}
          <div className="flex flex-col items-center md:col-span-1">
            <div className="relative group">
              <img
                src={profilePic || "/default-profile.png"}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-600"
              />
              <label htmlFor="file-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">Change</span>
              </label>
              <input id="file-upload" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="hidden" />
            </div>
            <p className="text-gray-400 text-sm mt-2">Max 2MB. JPG or PNG.</p>
            <FormError message={errors.profilePic} />
          </div>

          {/* --- Form Fields Section --- */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <input type="text" value={user.name} readOnly className="w-full bg-gray-700 p-2 rounded mt-1 cursor-not-allowed opacity-70" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" value={user.email} readOnly className="w-full bg-gray-700 p-2 rounded mt-1 cursor-not-allowed opacity-70" />
              </div>
            </div>
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-300">Institution</label>
              <input id="institution" type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1" />
              <FormError message={errors.institution} />
            </div>
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-300">Semester</label>
              <input id="semester" type="number" value={semester} min={1} max={10} onChange={(e) => setSemester(e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1" />
              <FormError message={errors.semester} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Subjects</label>
              <Tags
                whitelist={predefinedSubjects}
                mode="select"
                placeholder="Add your subjects"
                dropdown={{ enabled: 1, fuzzySearch: true, position: "all", highlightFirst: true }}
                value={subjects.map(subj => ({ value: subj }))}
                onChange={handleSubjectsChange}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-colors flex items-center">
                {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Profile;
