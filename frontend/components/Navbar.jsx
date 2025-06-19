import React, { useContext, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../src/images/logo.jpg";
import { auth, provider, signInWithPopup } from "../library/firebase";
import axios from "axios";
import { toast } from "react-toastify";
import { NotesContext } from "../src/context/NotesContext";
import profile from "../src/images/profile2.jpeg";

function Navbar() {
  const { backendUrl, user, setUser, loadingUser } = useContext(NotesContext);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log(backendUrl)

      const response = await axios.post(backendUrl + "/api/auth/google-login",
        { idToken },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Logged in successfully");
        setUser(response.data.user); // 👈 save user to context
        navigate("/");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Google Login Error", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-between pt-5 font-medium">
      <Link to="/">
        <img src={logo} className="w-20" alt="" />
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
      </ul>

      <div className="hidden sm:flex gap-5 text-md text-white">
        {!loadingUser && (
          !user ? (
            <button
              onClick={handleGoogleLogin}
              className="bg-gray-800 hover:bg-blue-600 hover:scale-105 transition duration-300 rounded-xl px-6 py-2"
            >
              Sign in
            </button>
          ) : (
            <Link to="/profile">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <img
                  src={user?.profilePicture || profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default Navbar;
