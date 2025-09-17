import React, {createContext, useState, ReactNode, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "@/models/user"



type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    logout: () => Promise<void>;
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

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser({
                logged: false,
                id: null,
                name: null,
                surname: null,
                identityNumber: null,
                role: null,
                plate: []
            });
        } catch (e) {
            console.error('Failed to log out', e)
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userJson = await AsyncStorage.getItem("user");
                if (userJson) {
                    const storedUser = JSON.parse(userJson);
                    setUser(storedUser);
                }
            } catch (e) {
                console.error("Failed to load user from storage", e);
            }
        };
        loadUser();
    }, []);
    
    useEffect(() => {
        const saveUser = async () => {
            try {
                const userJson = JSON.stringify(user);
                await AsyncStorage.setItem("user", userJson);
            } catch (e) {
                console.error("Failed to save user to storage", e);
            }
        };

        if (user.id !== null) {
            saveUser();
        }
    }, [user])

    return (
        <UserContext.Provider value ={{ user, setUser, logout }}>
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