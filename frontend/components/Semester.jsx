import React from "react";

function Semester() {
  const semesters = Array.from({ length: 10 }, (_, i) => `Semester ${i + 1}`);

  return (
    <div className="min-h-screen text-white px-6 py-20">
      <h1 className="text-3xl font-bold text-center mb-10">
        Choose a Semester
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {semesters.map((sem, index) => (
          <div
            key={index}
            className="bg-gray-800 hover:bg-blue-600 hover:scale-105 transition duration-300 rounded-xl p-6 flex items-center justify-center text-xl font-semibold cursor-pointer shadow-lg"
          >
            {sem}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Semester;
