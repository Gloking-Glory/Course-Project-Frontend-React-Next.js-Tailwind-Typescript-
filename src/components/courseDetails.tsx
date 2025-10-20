"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, ArrowLeft } from "lucide-react";
import { useCourseDetail } from "../hooks/useCourses";
import { UpdateCourseModal } from "./updateCourseModal";

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  console.log(id);
  const [updateModal, setUpdateModal] = useState(false);

  const { data: course, isPending, error, refetch } = useCourseDetail(id);

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="text-blue-600 font-semibold">Loading course details...</p>
      </div>
    );

  if (error || !course)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="text-red-500 font-medium">Course not found or an error occurred.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-blue-100 relative">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setUpdateModal(true)}
            className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
            title="Edit Course"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          {course.course_title}
        </h1>

        <div className="grid sm:grid-cols-2 gap-6 text-blue-800">
          <div>
            <p className="text-blue-500 text-sm">University</p>
            <p className="font-medium">{course.university}</p>
          </div>
          <div>
            <p className="text-blue-500 text-sm">Duration</p>
            <p className="font-medium">{course.duration}</p>
          </div>
          <div>
            <p className="text-blue-500 text-sm">Location</p>
            <p className="font-medium">{course.location}</p>
          </div>
          <div>
            <p className="text-blue-500 text-sm">Fees</p>
            <p className="font-medium">${course.fees}</p>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>

      <UpdateCourseModal
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        course={course}
        refetchList={refetch}
      />

    </div>
  );
}
