import React from "react";

function About() {
  return (
    <div className="min-h-screen text-white px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">About NoteNest</h1>

      <p className="text-lg mb-4">
        <strong>NoteNest</strong> is a notes management platform designed
        exclusively for{" "}
        <span className="text-blue-500 font-medium">college students</span>. It
        helps students stay organized by offering semester-wise note storage,
        easy access, and clean formatting.
      </p>

      <p className="text-lg mb-4">
        This platform was created to eliminate the hassle of messy WhatsApp
        PDFs, scattered drives, or missed class notes. With NoteNest, everything
        you need is in one place — from midterm prep to final revision.
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mt-8 mb-4">
        Why NoteNest?
      </h2>
      <ul className="list-disc list-inside space-y-2 text-base">
        <li>📘 Centralized semester-wise note access</li>
        <li>📤 Upload and view notes anytime, anywhere</li>
        <li>👥 Designed for collaboration among classmates</li>
        <li>⚡ Fast and lightweight user experience</li>
        <li>🔐 Secure and privacy-focused</li>
      </ul>

      <h2 className="text-2xl font-semibold text-blue-500 mt-10 mb-4">
        Meet the Developers
      </h2>
      <p className="text-lg mb-2">
        NoteNest is proudly built by a team of computer science students
        passionate about improving academic workflows. We believe technology
        should empower students to focus more on learning, not managing files.
      </p>

      <p className="text-sm text-gray-600 italic mt-8">
        Have feedback or ideas? Reach out to us — we’d love to hear from you!
      </p>
    </div>
  );
}

export default About;
