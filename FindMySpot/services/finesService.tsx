import apiClient from "@/api/apiClient"
import FinesInterface from "@/models/fines"


export const fetchFines = async (): Promise<FinesInterface[]> => {
    const response = await apiClient.get("/api/fines/user")
    return response.data;
};
