"use client";
import ThemeContext from '@/context/ThemeContext';
import React, { useContext, useEffect, useState } from 'react'

const ThemeProvider = ({ children }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return <div />;
    return (
        <div className={theme}>
            {children}
        </div>
    )
}

export default ThemeProvider