import axios from "axios";
import { toast } from "react-toastify";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import logo from "../src/images/note_icon.png";
import { auth, provider, signInWithPopup } from "../library/firebase";
import { NotesContext } from "../src/context/NotesContext";
import profile from "../src/images/profile2.jpeg";

function Navbar() {
  const { backendUrl, user, setUser, loadingUser } = useContext(NotesContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

const handleGoogleLogin = async () => {
  // Keep track of the page the user was on before starting the login process
  const currentPath = window.location.pathname;
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const response = await axios.post(
      `${backendUrl}/api/auth/google-login`,
      { idToken },
      { withCredentials: true }
    );

    if (response.data.success) {
      toast.success("Logged in successfully");
      const user = response.data.user;
      setUser(user);

      // --- New Logic ---
      // Check the user's role and navigate accordingly
      if (user.role === 'admin') {
        navigate('/admin-dashboard'); // Or your preferred admin route
      } else {
        // For regular users, navigate to the page they were on, or a default page
        navigate(currentPath === '/login' ? '/' : currentPath);
      }
      
    } else {
      toast.error("Login failed");
    }
  } catch (error) {
    console.error("Google Login Error", error);
    toast.error("Google login failed");
  }
};

  const handleLogout = async () => {
    try {
      await axios.post(
        backendUrl + "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      await signOut(auth);
      setUser(null);
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between pt-5 font-medium">
      <Link to="/">
        <img src={logo} className="w-13" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-md text-white">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
        </NavLink>
        <NavLink to="/user/home" className="flex flex-col items-center gap-1">
          <p>Home_updated</p>
        </NavLink>
        <NavLink to="/resources" className="flex flex-col items-center gap-1">
          <p>Resources</p>
        </NavLink>
      </ul>

      <div className="hidden sm:flex gap-5 text-md text-white">
        {!loadingUser &&
          (!user ? (
            <button
              onClick={handleGoogleLogin}
              className="bg-gray-800 hover:bg-blue-600 hover:scale-105 transition duration-300 rounded-xl px-6 py-2"
            >
              Sign in
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white focus:outline-none"
              >
                <img
                  src={user?.profilePicture || profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Navbar;
