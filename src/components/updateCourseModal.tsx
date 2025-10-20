"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { X } from "lucide-react";
import { AxiosError } from "axios";
import AlertModal, { AlertType } from "./utils/alertModal";
import { useUpdateCourse } from "../hooks/useCourses";
import { CourseData, CourseIdData } from "./types";
import { GenErrType } from "../hooks/apiTypes";

interface UpdateCourseModalProps {
  open: boolean;
  course: CourseData;
  onClose: () => void;
  refetchList: () => void;
}

export const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({
  open, onClose, course, refetchList
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseData>({
    defaultValues: {
      course_title: "",
      university: "",
      duration: "",
      location: "",
      fees: 0,
    },
  });

  const courseId: CourseIdData = { id: course?.id || '' };
  const { mutate, isPending } = useUpdateCourse();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("success");
  const [alertMessage, setAlertMessage] = useState({ title: "", subtitle: "" });

  useEffect(() => {
    if (course) {
      reset({
        course_title: course.course_title || "",
        university: course.university || "",
        duration: course.duration || "",
        location: course.location || "",
        fees: course.fees || 0,
      });
    }
  }, [course, reset]);

  const inputFields = [
    { label: "Course Title", name: "course_title", required: true, errText: "Course Title is required", placeholder: 'Course Title' },
    { label: "University", name: "university", required: true, errText: "University is required", placeholder: 'University'},
    { label: "Duration", name: "duration", required: true, errText: "Duration is required", placeholder: 'Duration'},
    { label: "Location", name: "location", required: true, errText: "Location is required", placeholder: 'Location'},
    { label: "Fees", name: "fees", required: false, placeholder: 'Fees in numbers only ($)'},
  ];

  const handleSubmitUpdate = (data: CourseData) => {
    mutate(
      { id: courseId, data },
      {
        onSuccess: () => {
          setAlertType("success");
          setAlertMessage({ title: "Course Updated!", subtitle: "Course has been updated successfully." });
          setAlertOpen(true);
          refetchList();
          setTimeout(() => {
            setAlertOpen(false);
            onClose();
          }, 1500);
        },
        onError: (error: AxiosError<GenErrType>) => {
          const res = error.response?.data;
          const errMsg =
            typeof res === "object"
              ? Object.values(res)[0]?.[0] || "Failed to update course"
              : "Failed to update course";
          setAlertType("error");
          setAlertMessage({ title: "Update Failed", subtitle: errMsg });
          setAlertOpen(true);
        },
      }
    );
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-white to-blue-50 w-full max-w-lg rounded-2xl shadow-2xl p-8 relative border border-blue-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center mt-6">
            Update Course
          </h2>

          <form
            onSubmit={handleSubmit(handleSubmitUpdate)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {inputFields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-semibold text-blue-900">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-300 bg-white/80 text-blue-900 placeholder-blue-400 p-3 rounded-lg outline-none transition"
                  {...register(field.name as keyof CourseData, {
                    required: field.required ? field.errText : false,
                    setValueAs: (val: string) => {
                      if (field.name === "fees") {
                        const num = Number(val);
                        return isNaN(num) || val === "" ? 0 : num;
                      }
                      return val;
                    },
                  })}
                />
                {errors[field.name as keyof typeof errors] && (
                  <span className="text-red-500 text-sm mt-1">
                    {(errors[field.name as keyof typeof errors]?.message as string) ||
                      "This field is required"}
                  </span>
                )}
              </div>
            ))}

            <div className="col-span-full flex justify-end mt-4">
              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition cursor-pointer"
              >
                {isPending ? (
                  <>
                    <CircularProgress size={18} color="inherit" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlertModal
        isOpen={alertOpen}
        type={alertType}
        title={alertMessage.title}
        subtitle={alertMessage.subtitle}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
};
