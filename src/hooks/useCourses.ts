import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../components/utils/apiRequest";
import { CourseData, CourseIdData } from "../components/types";
import type { AxiosError } from 'axios';
import {
    CourseRspType, CourseListRspType, GenErrType, GenRspType
} from "./apiTypes";

const searchQuery = (course_title?: string, university?: string) => {
    const params = new URLSearchParams();
    if (course_title) params.append('course_title', course_title);
    if (university) params.append('university', university);
    return params.toString() ? `?${params.toString()}` : "";
}

const fetchCourses = async (course_title?: string, university?: string) => {
    const query = searchQuery(course_title, university);
    return apiRequest.get<CourseListRspType>(`/courses/${query}`);
};

const addCourse = (data: CourseData) => apiRequest.post<CourseRspType>('/courses/add-course/', data);
const updateCourse = (id: CourseIdData, data: CourseData) => apiRequest.put<CourseRspType>(`/courses/${id.id}/update/`, data);
const deleteCourse = (data: CourseIdData) => apiRequest.delete<GenRspType>(`/courses/${data.id}/delete/`);
const courseDetail = (id: string) => apiRequest.get<CourseRspType>(`/courses/${id}/`);

export const useAddCourse = () => {
    return useMutation<CourseRspType, AxiosError<GenErrType>, CourseData>({
        mutationFn: addCourse,
    });
};

export const useCoursesList = (course_title: string, university: string) => {
    return useQuery<CourseListRspType, AxiosError<GenErrType>>({
        queryKey: ['coursesList', course_title, university],
        queryFn: () => fetchCourses(course_title, university),
    });
};

export const useDelCourse = () => {
    return useMutation<GenRspType, AxiosError<GenErrType>, CourseIdData>({
        mutationFn: deleteCourse,
    });
};

export const useUpdateCourse = () => {
    return useMutation<CourseRspType, AxiosError<GenErrType>, { id: CourseIdData, data: CourseData }>({
        mutationFn: ({ id, data }) => updateCourse(id, data),
    });
};

export const useCourseDetail = (id: string | undefined) =>{
    return useQuery<CourseRspType, AxiosError<GenErrType>>({
        queryKey: ['courseDetail', id],
        queryFn: async () => {
            const res = await courseDetail(id as string);
            return res;
        },
        enabled: !!id,
    });
};
