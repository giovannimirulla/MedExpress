"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, loginPharmacy } from '@/services/authService';
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
    const [accessToken, setAccessToken] = useState<string | null>(
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    );
    const [entityType, setEntityType] = useState<AuthEntityType>(
        typeof window !== 'undefined' ? localStorage.getItem('entityType') as AuthEntityType : AuthEntityType.User
    );
    const [role, setRole] = useState<Role | null>(
        typeof window !== 'undefined' ? localStorage.getItem('role') as Role : null
    );
    const [id, setId] = useState<string | null>(
        typeof window !== 'undefined' ? localStorage.getItem('id') : null
    );
    const [name, setName] =     useState<string | null>(
        typeof window !== 'undefined' ? localStorage.getItem('name') : null
    );
        
    
    // is logged in
    const isLoggedIn = useCallback(() => {
        //with localStorage
        if (typeof window !== 'undefined') {
            return !!accessToken || !!localStorage.getItem('accessToken');
        }
        return !!accessToken;
    }, [accessToken]);

    useEffect(() => {
        const loggedIn = isLoggedIn();
        if(loggedIn){
            if(window.location.pathname === '/login' || window.location.pathname === '/login/'){
                window.location.href = '/';
            }else if(window.location.pathname === '/signup' || window.location.pathname === '/signup/'){
                window.location.href = '/';
            }
         }else{
                if(window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/'){
                    window.location.href = '/login';
         }
        }
    }, [isLoggedIn]);

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
