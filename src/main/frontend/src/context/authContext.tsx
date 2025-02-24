"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, loginPharmacy, refreshAccessToken } from '@/services/authService';
import { AuthEntityType } from '@/enums/AuthEntityType';

interface AuthContextType {
    accessToken: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoggedIn: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshingToken, setRefreshingToken] = useState<string | null>(null);



    const login = async (entity: AuthEntityType, email: string, password: string) => {

        let result;
        if (entity === AuthEntityType.User) {
            result = await loginUser(email, password);
        } else {
            result = await loginPharmacy(email, password);
        }

        if (result && result.accessToken && result.refreshToken) {
            setAccessToken(result.accessToken);
            setRefreshingToken(result.refreshToken);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            return true;
        }
        return false;
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshingToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // is logged in
    const isLoggedIn = () => {
        return !!accessToken;
    }

    // Auto-refresh token quando l'app si avvia
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('refreshToken') || refreshingToken;
            if (!token) return;
            const result = await refreshAccessToken(token);
            if (result && result.accessToken && result.refreshToken) {
                setAccessToken(result.accessToken);
                setRefreshingToken(result.refreshToken);
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refreshToken);
            }
        };
        initializeAuth();
    }, [refreshingToken]);

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
    return context;
};
