export interface GenErrType {
    [key: string]: string[] | undefined;
}

export interface GenRspType {
    message: string;
}

export interface CourseRspType {
    id: string;
    course_title: string;
    university: string;
    duration: string;
    location: string;
    fees: number,
    created_at: string;
    updated_at: string;
}

export interface CourseListRspType {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        courses: CourseRspType[];
    }
}
