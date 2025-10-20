"use client";

import React, { useEffect, useState } from "react";

interface SearchCoursesProps {
  handleSearch: (filters: { course_title: string | null; university: string | null }) => void;
}

const SearchCourses: React.FC<SearchCoursesProps> = ({ handleSearch }) => {
  const [course_title, setCourseTitle] = useState("");
  const [university, setUniversity] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (course_title.length >= 3 || university.length >= 3 || (!course_title && !university)) {
        handleSearch({
          course_title: course_title.length >= 3 ? course_title.trim() : null,
          university: university.length >= 3 ? university.trim() : null,
        });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [course_title, university, handleSearch]);

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-blue-100 w-full">
      <h2 className="text-blue-800 text-lg font-semibold mb-4">Search Course</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          value={course_title}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Search by course title..."
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="Search by university..."
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
};

export default SearchCourses;
