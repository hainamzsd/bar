"use client";

import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const INITAL_USER: IUser = {
    id: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
    dob: null,
    gender: null,
};

const INITIAL_STATE: IContextType = {
    user: INITAL_USER,
    isLoading: false,
    setUser: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITAL_USER);
    const [isLoading, setIsLoading] = useState(true); // Set to true initially
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();
            console.log(currentAccount)
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const cookieFallback = localStorage.getItem('cookieFallBack');
        if (cookieFallback === '[]') {
            router.push('/');
        } else {
            checkAuthUser();
        }
    }, []); 

    const value: IContextType = {
        user,
        isLoading,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
