import React, {createContext, useState, ReactNode, useContext} from 'react';

type Plate = {
    id: number;
    number: string;
    userId: number
}

type User = {
    logged: boolean;
    id: string | null;
    name: string | null;
    surname: string | null;
    identityNumber: string | null;
    role: string | null;
    plate: Plate[] | [];
};

type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>({
        logged: false,
        id: null,
        name: null,
        surname: null,
        identityNumber: null,
        role: null,
        plate: []
    });

    return (
        <UserContext.Provider value ={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;