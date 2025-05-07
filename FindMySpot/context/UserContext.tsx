import React, {createContext, useState, ReactNode} from 'react';

type User = {
    logged: boolean;
    role: string | null;
    id: string | null;
};

type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        logged: false,
        role: null,
        id: null,
    });

    return (
        <UserContext.Provider value ={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    );
};

export default UserContext;