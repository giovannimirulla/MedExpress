"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { loginUserApi, loginPharmacyApi, signupPharmacyApi, signupUserApi } from '@/services/authService';
import { AuthEntityType } from '@/enums/AuthEntityType';
import { Role } from '@/enums/Role';

interface AuthContextType {
    accessToken: string | null;
    login: (entity: AuthEntityType, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoggedIn: () => boolean;
    getEntityType: () => AuthEntityType;
    getRole: () => Role | null;
    getId: () => string | null;
    getName: () => string | null;
    signupUser: (user: {
        name: string,
        surname: string,
        fiscalCode: string,
        address: string,
        email: string,
        password: string,
        role: string,
        doctorId?: string,
    }) => Promise<boolean | null>;
    signupPharmacy: (pharmacy: {    
        nameCompany: string,
        vatNumber: string,
        address: string,
        email: string,
        password: string,
    }) => Promise<boolean | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(
        typeof window !== 'undefined' ? Cookies.get('accessToken') || null : null
    );
    const [entityType, setEntityType] = useState<AuthEntityType>(
        typeof window !== 'undefined' ? (Cookies.get('entityType') as AuthEntityType) || AuthEntityType.User : AuthEntityType.User
    );
    const [role, setRole] = useState<Role | null>(
        typeof window !== 'undefined' ? (Cookies.get('role') as Role) || null : null
    );
    const [id, setId] = useState<string | null>(
        typeof window !== 'undefined' ? Cookies.get('id') || null : null
    );
    const [name, setName] = useState<string | null>(
        typeof window !== 'undefined' ? Cookies.get('name') || null : null
    );

    // is logged in
    const isLoggedIn = useCallback(() => {
        if (typeof window !== 'undefined') {
            return !!accessToken || !!Cookies.get('accessToken');
        }
        return !!accessToken;
    }, [accessToken]);

    useEffect(() => {
        const loggedIn = isLoggedIn();
        if (loggedIn) {
            if (window.location.pathname === '/login' || window.location.pathname === '/login/') {
                window.location.href = '/';
            } else if (window.location.pathname === '/signup' || window.location.pathname === '/signup/') {
                window.location.href = '/';
            }
        } else {
            if (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/') {
                window.location.href = '/login';
            }
        }
    }, [isLoggedIn]);

    const login = async (entity: AuthEntityType, email: string, password: string) => {
        let result;
        if (entity === AuthEntityType.User) {
            result = await loginUserApi(email, password);
            setRole(result?.role || Role.Patient);
            Cookies.set('role', result?.role || Role.Patient);
        } else {
            result = await loginPharmacyApi(email, password);
            setRole(null);
            Cookies.remove('role');
        }

        if (result && result.accessToken && result.refreshToken && result.id && result.name) {
            setName(result.name);
            setAccessToken(result.accessToken);
            setEntityType(entity);
            setId(result.id);
            Cookies.set('accessToken', result.accessToken);
            Cookies.set('refreshToken', result.refreshToken);
            Cookies.set('id', result.id);
            Cookies.set('name', result.name);
            Cookies.set('entityType', entity);
            return true;
        }
        return false;
    };

    const signupUser = async (user: {
        name: string,
        surname: string,
        fiscalCode: string,
        address: string,
        email: string,
        password: string,
        role: string,
        doctorId?: string,
    }) => {
        try {
            const response = await signupUserApi(user);
            return response ? true : false;
        } catch (error) {
            console.error('Errore di signup', error);
            return null;
        }
    };

    const signupPharmacy = async (pharmacy: {
        nameCompany: string,
        vatNumber: string,
        address: string,
        email: string,
        password: string,
    }) => {
        try {
            const response = await signupPharmacyApi(pharmacy);
            return response ? true : false;
        } catch (error) {
            console.error('Errore di signup', error);
            return null;
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRole(null);
        setId(null);
        setName(null);
        setEntityType(AuthEntityType.User);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('role');
        Cookies.remove('id');
        Cookies.remove('name');
        Cookies.remove('entityType');
        // Eventuale reindirizzamento alla pagina di login:
        window.location.href = '/login';
    };

    // get entity type
    const getEntityType = () => {
        if (typeof window !== 'undefined') {
            return entityType || (Cookies.get('entityType') as AuthEntityType) || AuthEntityType.User;
        }
        return entityType;
    };

    // get role
    const getRole = () => {
        if (typeof window !== 'undefined') {
            return role || (Cookies.get('role') as Role) || null;
        }
        return role;
    };

    // get id
    const getId = () => {
        if (typeof window !== 'undefined') {
            return id || Cookies.get('id') || null;
        }
        return id;
    };

    // get name
    const getName = () => {
        if (typeof window !== 'undefined') {
            return name || Cookies.get('name') || null;
        }
        return name;
    };

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, isLoggedIn, getEntityType, getRole, getId, getName, signupUser, signupPharmacy }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve essere usato dentro un AuthProvider');
    return context;
};