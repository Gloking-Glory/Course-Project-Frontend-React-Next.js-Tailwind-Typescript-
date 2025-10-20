"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import { CourseData } from "./types";
import { useAddCourse } from "../hooks/useCourses";
import { AxiosError } from "axios";
import { GenErrType } from "../hooks/apiTypes";
import AlertModal, { AlertType } from "./utils/alertModal";

interface Props {
  refetchList: () => void
}

export const CourseForm = ({ refetchList }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseData>();

  const { mutate, isPending } = useAddCourse();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('success');
  const [alertMessage, setAlertMessage] = useState({title: '', subtitle: ''});

  const inputFields = [
    { label: "Course Title", name: "course_title", required: true, errText: "Course Title is required", placeholder: 'Course Title' },
    { label: "University", name: "university", required: true, errText: "University is required", placeholder: 'University' },
    { label: "Duration", name: "duration", required: true, errText: "Duration is required", placeholder: "Duration" },
    { label: "Location", name: "location", required: true, errText: "Location is required", placeholder: "Location" },
    { label: "Fees", name: "fees", required: false, placeholder: "Fees in numbers only ($)" },
  ];

  const handleAddCourse = (data: CourseData) => {
    mutate(data, {
      onSuccess: () => {
        setAlertType('success');
        setAlertMessage({ title: 'Course Added!', subtitle: 'Course has been added successfully'});
        setAlertOpen(true);
        refetchList();
        reset();
        setTimeout(() => {
          setAlertOpen(false);
        }, 1500);
      },
      onError: (error: AxiosError<GenErrType>) => {
        const res = error.response?.data;
          const errMsg =
            typeof res === 'object'
              ? Object.values(res)[0]?.[0] || 'Failed to add course successfully'
              : 'Failed to add course successfully';
        setAlertType('error');
        setAlertMessage({ title: 'Course Adding Failed!', subtitle: errMsg});
        setAlertOpen(true);
      },
    });
  };

  return (
    <>
        <form
            onSubmit={handleSubmit(handleAddCourse)}
            className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white/70 to-blue-50 p-8 rounded-2xl shadow-lg"
        >
        <h2 className="text-2xl font-bold mb-5 text-blue-900 text-center">Add Course</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {inputFields.map((field) => (
            <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-semibold text-blue-900">{field.label}</label>
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
                {errors[field.name as keyof CourseData] && (
                <span className="text-red-500 text-sm mt-1">
                  {(errors[field.name as keyof CourseData]?.message as string) || "This field is required"}
                </span>
                )}
            </div>
          ))}
        </div>

        <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition cursor-pointer"
        >
            {isPending ? (
                <>
                  <CircularProgress size={20} color="inherit" className="mr-2" />
                  Adding Course...
                </>
            ) : (
                "Add Course"
            )}
        </button>
        </form>

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
