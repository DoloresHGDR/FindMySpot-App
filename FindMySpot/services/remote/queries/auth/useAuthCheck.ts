import apiClient from "@/services/remote/apiClient";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { User } from "@/models/user";
import { getToken, removeToken } from "@/services/local/storage/tokenStorage";
import { decodeJwtToken, isTokenExpired } from "@/utils/tokenUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const fetchUserData = async (identityNumber: string): Promise<User> => {
    const response = await apiClient.get(`/api/users/identity/${identityNumber}`)
    const user = response.data

    return {
        logged: true,
        id: user.id,
        name: user.name,
        surname: user.surname,
        identityNumber: user.identityNumber,
        role: user.role,
        plate: user.plates
    };
};

export const useAuthCheck = () => {
    const queryClient = useQueryClient();

    const authMutation = useMutation({
        mutationFn: async (): Promise<User> => {
            const token = await getToken();
            if (!token || isTokenExpired(token)) {
                await removeToken()
                throw new Error("No token or token expired"); 
            }

            const decoded = decodeJwtToken(token);
            if (!decoded?.sub) {
                await removeToken();
                throw new Error("Invalid token format");
            }

            return await fetchUserData(decoded.sub);
        },

        onSuccess: (userData) => {
            queryClient.setQueryData([QUERY_KEYS.USER], userData);
        },
        onError: async () => {
            await removeToken();
        },
    });

    return authMutation;
};