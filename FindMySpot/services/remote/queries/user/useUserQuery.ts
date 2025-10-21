import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from "@/models/user";
import { QUERY_KEYS } from '@/constants/queryKeys';
import { removeToken } from "@/services/local/storage/tokenStorage";
import { getUserData } from '@/services/remote/user/authService';

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

export const useUser = () => {
    const queryClient = useQueryClient();

    const { data: user, refetch, ...rest } = useQuery<User>({
        queryKey: [QUERY_KEYS.USER],
        initialData: INITIAL_USER_STATE,
        queryFn: getUserData
    });

    const setUserData = (newUserData: User) => {
        queryClient.setQueryData([QUERY_KEYS.USER], newUserData);
    };

    const logout = async () => {
        await removeToken();
        queryClient.setQueryData([QUERY_KEYS.USER], INITIAL_USER_STATE);
        await queryClient.removeQueries(); 
    };

    return {
        user: user || INITIAL_USER_STATE,
        setUserData,
        logout,
        refetch,
        ...rest
    };
};