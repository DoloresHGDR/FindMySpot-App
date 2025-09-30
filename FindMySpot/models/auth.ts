import { Plate } from "./user";

export type LoginPayload = {
    identityNumber: string;
    password: string;
    rememberMe: boolean;
};

export type AuthResponse = {
    token: string;
    id: string;
    name: string;
    surname: string;
    identityNumber: string;
    role: string;
    plates: Plate[]; 
};

export type RegisterPayload = {
    name: string;
    surname: string;
    identityNumber: string;
    password: string;
    confirmPassword: string;
    role: string;
};