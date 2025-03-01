"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, loginPharmacy, refreshAccessToken } from '@/services/authService';
import { AuthEntityType } from '@/enums/AuthEntityType';
import { Role } from '@/enums/Role';

interface AuthContextType {
    accessToken: string | null;
    login: (entity: AuthEntityType, username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoggedIn: () => boolean;
    getEntityType: () => AuthEntityType;
    getRole: () => Role | null;
    getId: () => string | null;
    getName: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshingToken, setRefreshingToken] = useState<string | null>(null);
    const [entityType, setEntityType] = useState<AuthEntityType>(AuthEntityType.User);
    const [role, setRole] = useState<Role | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);



    const login = async (entity: AuthEntityType, email: string, password: string) => {

        let result;
        if (entity === AuthEntityType.User) {
            result = await loginUser(email, password);
            setRole(result?.role || Role.Patient);
            localStorage.setItem('role', result?.role || Role.Patient);
        } else {
            result = await loginPharmacy(email, password);
            setRole(null);
            localStorage.removeItem('role');
        }


        if (result && result.accessToken && result.refreshToken && result.id && result.name) {
            setName(result.name);
            setAccessToken(result.accessToken);
            setRefreshingToken(result.refreshToken);
            setEntityType(entity);
            setId(result.id);
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('id', result.id);
            localStorage.setItem('name', result.name);
            localStorage.setItem('entityType', entity);
            return true;
        }


        return false;
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshingToken(null);
        setRole(null);
        setId(null);
        setName(null);
        setEntityType(AuthEntityType.User);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('entityType');
    };

    // is logged in
    const isLoggedIn = () => {
        return !!accessToken;
    }

    //get entity type
    const getEntityType = () => {
        if (typeof window !== 'undefined') {
            return entityType || localStorage.getItem('entityType') as AuthEntityType;
        }
        return entityType;
    }   

    //get role
    const getRole = () => {
        if (typeof window !== 'undefined') {
          return role || localStorage.getItem('role') as Role;
        }
        return role;
      }

    //get id
    const getId = () => {
        if (typeof window !== 'undefined') {
          return id || localStorage.getItem('id');
        }
        return id;
      }

    //get name
    const getName = () => {
        if (typeof window !== 'undefined') {
            return name || localStorage.getItem('name');
            }
            return name;
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
        <AuthContext.Provider value={{ accessToken, login, logout, isLoggedIn, getEntityType, getRole, getId, getName }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
    return context;
};
