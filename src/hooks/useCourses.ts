import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../components/utils/apiRequest";
import { CourseData, CourseIdData } from "../components/types";
import type { AxiosError } from 'axios';
import {
    CourseRspType, CourseListRspType, GenErrType, GenRspType
} from "./apiTypes";

const fetchCourses = () => apiRequest.get<CourseListRspType>('/courses/');
const addCourse = (data: CourseData) => apiRequest.post<CourseRspType>('/courses/add-course/', data);
const updateCourse = (id: CourseIdData, data: CourseData) => apiRequest.put<CourseRspType>(`/courses/${id.id}/update/`, data);
const deleteCourse = (data: CourseIdData) => apiRequest.delete<GenRspType>(`/courses/${data.id}/delete/`);
const courseDetail = (id: string) => apiRequest.get<CourseRspType>(`/courses/${id}/`);

export const useAddCourse = () => {
    return useMutation<CourseRspType, AxiosError<GenErrType>, CourseData>({
        mutationFn: addCourse,
    });
};

export const useCoursesList = () => {
    return useQuery<CourseListRspType, AxiosError<GenErrType>>({
        queryKey: ['coursesList'],
        queryFn: fetchCourses,
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
