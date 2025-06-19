import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


import "./App.css";
import { About, Contact, Home, Navbar, Profile, Semester } from "../components";


function App() {
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
      </Routes>
    </div>
  );
}


export default App;
