import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { NotesContext } from "../src/context/NotesContext";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(NotesContext);

  const handleGetStarted = () => {
    if (user) {
      navigate("/semester");
    } else {
      toast.info("Please login first");
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10 max-w-4xl mx-auto">
      <p className="text-lg mb-4">
        Welcome to <span className="font-semibold text-blue-500">NoteNest</span>{" "}
        — your all-in-one notes companion built specifically for{" "}
        <span className="underline">college students</span>. Our mission is
        simple: make academic life easier by providing a centralized space to
        <span className="font-medium">
          {" "}
          access, organize, and share notes semester-wise
        </span>
        .
      </p>

      <p className="text-lg mb-4">
        Whether you're preparing for your{" "}
        <span className="italic">midterms</span>, catching up on missed classes,
        or revising for your <span className="italic">finals</span>, NoteNest
        helps you stay on top of your studies with:
      </p>

      <ul className="list-disc list-inside text-base pl-2 mb-6 space-y-2">
        <li>
          📚 Well-organized notes for each{" "}
          <span className="font-semibold">semester</span> and{" "}
          <span className="font-semibold">subject</span>
        </li>
        <li>✍️ Clean, concise, and student-friendly formats</li>
        <li>🔍 Easy search and quick access to relevant topics</li>
        <li>🧠 Ideal for last-minute revision and collaborative learning</li>
      </ul>

      <p className="text-lg mb-8">
        Built <span className="font-semibold">by students, for students</span>,
        NoteNest is here to help you learn smarter — not harder. 💡
      </p>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
