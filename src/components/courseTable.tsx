"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { Pencil, Trash2 } from "lucide-react"; //
import { CourseRspType, GenErrType } from "../hooks/apiTypes";
import { useDelCourse } from "../hooks/useCourses";
import { CourseData, CourseIdData } from "./types";
import type { AxiosError } from "axios";
import AlertModal, { AlertType } from "./utils/alertModal";
import { UpdateCourseModal } from "./updateCourseModal";

interface Props {
  courses: CourseRspType[];
  loading: boolean
  refetchList: () => void;
}

export default function CoursesTable({ courses, loading, refetchList }: Props) {
  const headers = ['Title', 'University', 'Duration', 'Location', 'Fees', 'Actions'];
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('success');
  const [alertMessage, setAlertMessage] = useState({title: '', subtitle: ''});
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData>({
    id: '',
    course_title: '',
    university: '',
    duration: '',
    location: '',
    fees: 0,
  });
  
  const { mutate, isPending } = useDelCourse();
  const router = useRouter();

  const handleEditSelect = (courseData: CourseRspType) => {
    setSelectedCourse(courseData);
    setUpdateModal(true);
  };

  const handleDelCourse = (id: CourseIdData) => {
    mutate(
      { ...id },
      {
        onSuccess: () => {
          setAlertType('success');
          setAlertMessage({ title: 'Course Deleted!', subtitle: 'Course has been deleted successfully'});
          setAlertOpen(true);
          refetchList();
        },
        onError: (error: AxiosError<GenErrType>) => {
          const res = error.response?.data;
          const errMsg =
            typeof res === 'object'
              ? Object.values(res)[0]?.[0] || 'Failed to delete course successfully'
              : 'Failed to delete course successfully';
          setAlertType('error');
          setAlertMessage({ title: 'Course Deletion Failed!', subtitle: errMsg});
          setAlertOpen(true);
        },
      }
    );
  };

  return (
    <div className="bg-gradient-to-br from-white/70 to-blue-50/50 shadow-lg rounded-xl overflow-hidden border border-blue-100">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-left text-blue-900">
          <thead className="bg-blue-100/80 text-blue-900 uppercase text-sm font-semibold">
            <tr>
              {headers.map((header) => (
                <th className="px-4 py-2 text-sm whitespace-nowrap" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={headers.length}>
                  <div className="flex justify-center items-center py-10">
                    <CircularProgress size={30} color="inherit" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="text-blue-800">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-blue-50/80 transition border-b border-blue-100"
                  >
                    <td
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="px-4 py-2 text-sm whitespace-nowrap cursor-pointer"
                    >
                      {course.course_title}
                    </td>
                    <td
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="px-4 py-2 text-sm whitespace-nowrap cursor-pointer"
                    >
                      {course.university}
                    </td>
                    <td className="px-4 py-2 text-sm whitespace-nowrap">{course.duration}</td>
                    <td className="px-4 py-2 text-sm whitespace-nowrap">{course.location}</td>
                    <td className="px-4 py-2 text-sm whitespace-nowrap">${course.fees}</td>
                    <td className="px-4 py-2 text-sm whitespace-nowrap text-right space-x-3">
                      {isPending ? (
                        <CircularProgress size={20} color="inherit" className="mr-2" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditSelect(course)}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelCourse({ id: course.id })}
                            className="text-red-500 hover:underline cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-center text-blue-400 italic"
                  >
                    No courses available.
                  </td>
                </tr>
              )}
            </tbody>

          )}
        </table>
      </div>

      <AlertModal
        isOpen={alertOpen}
        type={alertType}
        title={alertMessage.title}
        subtitle={alertMessage.subtitle}
        onClose={() => setAlertOpen(false)}
      />

      <UpdateCourseModal
        open={updateModal}
        onClose={() => setUpdateModal(false)}
        course={selectedCourse}
        refetchList={refetchList}
      />

    </div>
  );
}
