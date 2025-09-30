import { QUERY_KEYS } from "@/constants/queryKeys";
import { Plate, User } from "@/models/user";
import { saveToken } from "@/services/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type LoginPayload = {
    identityNumber: string;
    password: string;
    rememberMe: boolean;
};

type AuthResponse = {
    token: string;
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    role: string;
    plates: Plate[]; 
};

const performLogin = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post('http://192.168.1.40:8080/api/auth/login', {
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

type RegisterPayload = {
    name: string;
    surname: string;
    identityNumber: string;
    password: string;
    confirmPassword: string;
    role: string;
};

const performRegister = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axios.post('http://192.168.1.40:8080/api/auth/register', payload);
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