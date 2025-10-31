import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:8000/api";

const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    timeout: 10000
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href ='/';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
