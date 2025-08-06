import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "./App.css";
import { About, Contact, Home, Navbar, Profile, Semester } from "../components";
import {
  UserHome,
  FolderView,
  PdfView,
  Resources,
  AdminDashboard,
} from "./pages";
import { useContext } from "react";
import { NotesContext } from "./context/NotesContext";

function App() {
  const { user } = useContext(NotesContext);

  if (user && user.role === "admin") {
    return (
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <ToastContainer />
        <AdminDashboard />
      </div>
    );
  } else {
    return (
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/semester" element={<Semester />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/folders/:folderId" element={<FolderView />} />
          <Route path="/view/:noteId" element={<PdfView />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
    );
  }
}

export default App;
