"use client";

import { toast, useToast } from '@/hooks/use-toast';
import { getCurrentUser, updateUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const INITIAL_USER: IUser = {
  accountId: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
  dob: undefined,
  gender: undefined,
  facebookLink: undefined,
  twitterLink: undefined,
  backgroundUrl: '',
  isActive: true,
  role: 'customer',
  joinDate: new Date().toLocaleDateString("vi-VN"),
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  updateUserInfo: async () => false,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const filterUserAttributes = (data: any): Partial<IUser> => {
    const allowedKeys: Array<keyof IUser> = [
      'accountId', 'username', 'email', 'imageUrl', 'bio', 'dob', 'gender',
      'facebookLink', 'twitterLink', 'backgroundUrl', 'isActive', 'role', 'joinDate'
    ];
    return Object.keys(data)
      .filter(key => allowedKeys.includes(key as keyof IUser))
      .reduce((obj, key) => {
        obj[key as keyof IUser] = data[key];
        return obj;
      }, {} as Partial<IUser>);
  };

  const updateUserInfo = async (userData: Partial<IUser>) => {
    try {
      const filteredData = filterUserAttributes(userData);
      console.log(filteredData);
      const updatedUser = await updateUser(user.accountId, filteredData);
      if (updatedUser) {
        setUser({ ...user, ...updatedUser, accountId: user.accountId });
        // toast({
        //   title: 'Success',
        //   description: 'Profile updated successfully',
        // });
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      // toast({
      //   title: 'Error',
      //   description: 'Failed to update profile',
      //   variant: 'destructive',
      // });
      return false;
    }
  };

  const checkAuthUser = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const currentAccount = await getCurrentUser();
        if (currentAccount) {
          setUser({
            accountId: currentAccount.$id,
            username: currentAccount.username,
            email: currentAccount.email,
            imageUrl: currentAccount.imageUrl,
            bio: currentAccount.bio,
            joinDate: currentAccount.$createdAt,
            dob: currentAccount.dob,
            backgroundUrl: currentAccount.backgroundUrl,
            facebookLink: currentAccount.facebookLink,
            twitterLink:currentAccount.twitterLink,
            isActive: true,
            role: 'customer'
          });
          setIsAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    setIsAuthenticated(false);
    return false;
  };

  useEffect(() => {
    const initAuth = async () => {
      const cookieFallback = localStorage.getItem('cookieFallBack');
      if (cookieFallback === '[]') {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push('/');
      } else {
        await checkAuthUser();
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: IContextType = {
    user,
    isLoading,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    updateUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);