import apiClient from "@/services/remote/apiClient";
import { getToken, removeToken } from "../../local/storage/tokenStorage";
import { decodeJwtToken, isTokenExpired } from "@/utils/tokenUtils";
import { User } from "@/models/user";

const INITIAL_USER_STATE: User = { 
    logged: false,
    id: null,
    name: null,
    surname: null,
    identityNumber: null,
    role: null,
    plate: [],
    balance: 0
};

export const getUserData = async (): Promise<User> => {
    try {
        const token = await getToken();
        if (!token || isTokenExpired(token)) {
            await removeToken();
            return INITIAL_USER_STATE
        }
        
        const decoded = decodeJwtToken(token);
        if (!decoded?.sub) {
            await removeToken();
            return INITIAL_USER_STATE
        }
        
        const response = await apiClient.get(`/api/users/identity/${decoded.sub}`);
        const user = response.data;
        
        return {
            logged: true,
            id: user.id,
            name: user.name,
            surname: user.surname,
            identityNumber: user.identityNumber,
            role: user.role,
            plate: user.plates,
            balance: user.balance
        };

       
    } catch (error) {
        console.error("Failed to fetch user data from backend", error);
        await removeToken();
        return INITIAL_USER_STATE
    }
};