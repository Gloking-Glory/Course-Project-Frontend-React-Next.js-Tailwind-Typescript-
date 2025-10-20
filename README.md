# University Courses Management App

Welcome to the University Courses Management App! This is a modern, responsive web application built with Next.js and TypeScript, designed to manage a database of university courses. It provides a clean and intuitive user interface for creating, reading, updating, deleting (CRUD), and searching for courses.

## ✨ Features

- **List Courses**: View all courses in a paginated, sortable table.
- **Course Details**: Click on a course title or university to see its dedicated details page.
- **Add Course**: A user-friendly form to add new courses to the system.
- **Update Course**: Edit existing course information through a sleek modal interface.
- **Delete Course**: Remove courses with a confirmation step.
- **Live Search**: Dynamically search for courses by title or university with debouncing for performance.
- **Pagination**: Efficiently navigate through a large list of courses.
- **Responsive Design**: A mobile-first design that looks great on all devices, from desktops to smartphones.
- **Notifications**: Interactive and animated alert modals for user feedback on actions (e.g., success or error on course creation).

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React Framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- **UI Components**:
  - [Material-UI](https://mui.com/) for components like `CircularProgress`.
  - Lucide React for a beautiful and consistent icon set.
- **State Management**: TanStack Query (React Query) for managing server state, caching, and data fetching.
- **Animations**: Framer Motion for smooth, animated UI transitions.
- **Forms**: React Hook Form for performant and flexible form handling.
- **API Client**: Axios for making HTTP requests to the backend API.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js (version 18.x or later) and npm or yarn installed on your system.

### Local Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd jeceApp
    ```

2.  **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```

    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**

    This project requires a backend API to function. Create a `.env` file in the root of the project and add the URL of your backend API.

    ```env
    NEXT_PUBLIC_API_URL=http://your-backend-api-url.com/api
    or 
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    if running it with local backend
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at http://localhost:3000.

## 🏗️ System Architecture

The application follows a component-based architecture, leveraging Next.js's App Router.

### Folder Structure

```
jeceApp/
├── src/
│   ├── app/
│   │   ├── courses/[id]/page.tsx  # (Assumed) Dynamic page for course details
│   │   ├── globals.css
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main page (Courses list)
│   │   └── providers.tsx          # React Query provider setup
│   │
│   ├── components/
│   │   ├── utils/
│   │   │   ├── alertModal.tsx     # Reusable alert modal
│   │   │   └── pagination.tsx     # Pagination component
│   │   ├── courseDetails.tsx      # UI for the course details page
│   │   ├── courseForm.tsx         # Form for adding a new course
│   │   ├── courseTable.tsx        # Table to display courses
│   │   ├── searchCourses.tsx      # Search input component
│   │   └── updateCourseModal.tsx  # Modal for updating a course
│   │
│   ├── hooks/
│   │   ├── apiTypes.ts            # TypeScript types for API responses
│   │   └── useCourses.ts          # Custom hooks for API interactions
│
└── package.json
```

### Frontend Workflow

1.  **`src/app/layout.tsx`**: The root layout wraps all pages. It includes the `Providers` component.
2.  **`src/app/providers.tsx`**: This client component sets up the `QueryClientProvider` for TanStack Query, making the query client available throughout the app.
3.  **`src/app/page.tsx`**: This is the main entry point for users.
    - It manages the state for search filters (`course_title`, `university`) and the current page number.
    - It uses the `useCoursesList` custom hook to fetch a paginated and filtered list of courses.
    - It renders the `CourseForm`, `SearchCourses`, and `CoursesTable` components.
4.  **Component Interaction**:
    - **`SearchCourses`**: Contains two input fields. It uses a `useEffect` with a 500ms debounce to call the `handleSearch` function (passed down as a prop), which updates the `searchFilter` state in `page.tsx`. This triggers a refetch by `useCoursesList`.
    - **`CourseForm`**: Uses `react-hook-form` to manage form state and validation. On submission, it calls the `useAddCourse` mutation. On success, it calls `refetchList()` to update the course table.
    - **`CoursesTable`**:
        - Receives the list of `courses` and the `loading` state.
        - Renders the data in a table.
        - Clicking a table row navigates the user to the course details page (`/courses/[id]`).
        - The "Edit" button opens the `UpdateCourseModal`, passing the selected course data.
        - The "Delete" button triggers the `useDelCourse` mutation.
    - **`UpdateCourseModal`**: A modal form pre-filled with the selected course's data. It uses the `useUpdateCourse` mutation to submit changes.
    - **`Pagination`**: Receives pagination data (`count`, `next`, `previous`) from the API response and allows the user to navigate between pages. Changing the page updates the `page` state in `page.tsx`, triggering a refetch.
    - **`AlertModal`**: A generic utility component used by `CourseForm`, `CoursesTable`, and `UpdateCourseModal` to display success or error feedback to the user after an operation.

### API Integration (`/hooks/useCourses.ts`)

All communication with the backend API is abstracted into custom hooks using TanStack Query. This provides benefits like caching, automatic refetching, and a clean separation of concerns.

-   **`useCoursesList(title, university, page)`**: A query hook (`useQuery`) that fetches the list of courses. It takes search filters and the page number as arguments, which are used to construct the API request URL. TanStack Query automatically refetches data when these arguments change.
    - **Endpoint**: `GET /courses?course_title={title}&university={university}&page={page}`

-   **`useCourseDetail(id)`**: A query hook (`useQuery`) that fetches the details for a single course by its ID.
    - **Endpoint**: `GET /courses/{id}`

-   **`useAddCourse()`**: A mutation hook (`useMutation`) for creating a new course. It handles `onSuccess` and `onError` callbacks to show notifications and refetch the course list.
    - **Endpoint**: `POST /courses`

-   **`useUpdateCourse()`**: A mutation hook (`useMutation`) for updating an existing course.
    - **Endpoint**: `PUT /courses/{id}` or `PATCH /courses/{id}`

-   **`useDelCourse()`**: A mutation hook (`useMutation`) for deleting a course.
    - **Endpoint**: `DELETE /courses/{id}`

### API Data Structure

Based on the frontend code, the API is expected to return data in the following formats:

**Course Object (`CourseRspType`)**
```json
{
  "id": "string",
  "course_title": "string",
  "university": "string",
  "duration": "string",
  "location": "string",
  "fees": "number"
}
```

**Paginated Course List Response**
```json
{
  "count": "number",
  "next": "string | null",
  "previous": "string | null",
  "results": {
    "courses": [
      // Array of Course Objects
    ]
  }
}
```