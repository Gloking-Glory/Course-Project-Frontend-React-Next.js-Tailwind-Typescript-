import apiClient from "./apiClient";

export const apiRequest = {
    get: async<ResponseType>(url: string): Promise<ResponseType> => apiClient.get<ResponseType, ResponseType>(url),
    post: async<ResponseType>(url: string, data: object): Promise<ResponseType> => apiClient.post<ResponseType, ResponseType>(url, data),
    put: async<ResponseType>(url: string, data: object): Promise<ResponseType> => apiClient.put<ResponseType, ResponseType>(url, data),
    patch: async<ResponseType>(url: string, data: object): Promise<ResponseType> => apiClient.patch<ResponseType, ResponseType>(url, data),
    delete: async<ResponseType>(url: string): Promise<ResponseType> => apiClient.delete<ResponseType, ResponseType>(url),
};
