"use client";
import { createContext, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const ThemeContext = createContext(); // Declare ThemeContext before exporting it

const getFromLocalStorage = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    const theme = localStorage.getItem('theme');
    return theme ? theme : 'light';
};

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(getFromLocalStorage());

    // Initialize window width state
    const [rawWindowWidth, setRawWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    // Apply debounce to window width calculations 
    const windowWidth = useDebounce(rawWindowWidth, 5);

    const toggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    // Handle window resize
    useEffect(() => {
        if (typeof window === 'undefined') return;

        function handleWindowResize() {
            setRawWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggle, windowWidth }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext; // Export ThemeContext after declaration