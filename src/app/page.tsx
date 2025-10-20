"use client";

import React, { useState } from "react";
import { CourseForm } from "../components/courseForm";
import CoursesTable from "../components/courseTable";
import { CourseRspType } from "../hooks/apiTypes";
import { useCoursesList } from "../hooks/useCourses";
import SearchCourses from "../components/searchCourses";

export default function CoursesPage() {
  const [searchFilter, setSearchFilter] = useState<{ course_title: string | null; university: string | null }>({
    course_title: null,
    university: null,
  });
  const { data, isPending, refetch  } = useCoursesList(searchFilter.course_title || '', searchFilter.university || '');
  const allCourses: CourseRspType[] = data?.results?.courses || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center py-10 px-2 sm:px-6">
      <div className="w-full max-w-[90rem] grid lg:grid-cols-2 gap-10">
        <div className="flex justify-end">
          <div className="w-full max-w-2xl">
            <CourseForm refetchList={refetch} />
          </div>
        </div>

        <div className="flex flex-col justify-start w-full max-w-4xl gap-6">
          <SearchCourses handleSearch={setSearchFilter} />

          <CoursesTable
            courses={allCourses}
            loading={isPending}
            refetchList={(refetch)}
          />
        </div>
      </div>
    </div>
  );
}
