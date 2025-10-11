import { QUERY_KEYS } from "@/constants/queryKeys";
import { Plate, User } from "@/models/user";
import { saveToken } from "@/services/local/storage/tokenStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ENDPOINTS } from "@/constants/apiEndpoints";
import { LoginPayload, AuthResponse, RegisterPayload } from "@/models/auth";

const fullLoginUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}${ENDPOINTS.LOGIN}`;
const fullRegisterUrl = `${process.env.EXPO_PUBLIC_API_BASE_URL}${ENDPOINTS.REGISTER}`;

const performLogin = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post(fullLoginUrl, {
          identityNumber: payload.identityNumber,
          password: payload.password,
    });

    return response.data;
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: performLogin,
        onSuccess: async (data, variables) => {
            const { token, id, name, surname, identityNumber, role, plates } = data;
            await saveToken(token, variables.rememberMe);
            const userData: User = {
                logged: true,
                id: id,
                name: name,
                surname: surname,
                identityNumber: identityNumber,
                role: role,
                plate: plates
            };
            queryClient.setQueryData([QUERY_KEYS.USER], userData);
        },
        onError: (error) => {
            throw error;
        }
    })
};

const performRegister = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axios.post(fullRegisterUrl, payload);
    return response.data;
};

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: performRegister,
        onSuccess: async (data) => {
            const { token, id, name, surname, identityNumber, role, plates } = data;
            await saveToken(token, false);
            const userData: User = {
                logged: true,
                id: id,
                name: name,
                surname: surname,
                identityNumber: identityNumber,
                role: role,
                plate: plates
            };
            queryClient.setQueryData([QUERY_KEYS.USER], userData);
        },
        onError: (error) => {
            throw error;
        }
    })
};