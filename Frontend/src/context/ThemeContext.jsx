"use client";
import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext(); // Declare ThemeContext before exporting it

const getFromLocalStorage = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    const theme = localStorage.getItem('theme');
    return theme ? theme : 'light';
}

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(getFromLocalStorage());

    const toggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext; // Export ThemeContext after declaration