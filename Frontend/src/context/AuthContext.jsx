"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status !== "loading") {
            setIsLoading(false);
        }
    }, [status]);

    const login = async (provider, credentials) => {
        if (provider === "credentials") {
            return signIn("credentials", {
                ...credentials,
                redirect: false,
            });
        }
        return signIn(provider);
    };

    const logout = () => {
        signOut({ redirect: true, callbackUrl: "/" });
    }; return (
        <AuthContext.Provider
            value={{
                user: session?.user,
                isAuthenticated: !!session?.user,
                accessToken: session?.accessToken,
                isLoading,
                status,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
