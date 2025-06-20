"use client";
import ThemeContext from '@/context/ThemeContext';
import React, { useContext, useEffect, useState } from 'react'
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from '@/context/AuthContext';

const ThemeProvider = ({ children }) => {
    const { theme, customTheme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) return <div />;
    
    return (
        <SessionProvider>
            <AuthProvider>
                <div className={`${theme} ${customTheme !== 'default' ? `theme-${customTheme}` : ''}`}>
                    {children}
                </div>
            </AuthProvider>
        </SessionProvider>
    )
}

export default ThemeProvider