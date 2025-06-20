"use client";
import { createContext, useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const ThemeContext = createContext(); // Declare ThemeContext before exporting it

// Theme options available across the application
export const themeOptions = [
    { id: 'default', name: 'Default', color: '#1a1a1a' },
    { id: 'ocean', name: 'Ocean Blue', color: '#0077b6' },
    { id: 'sunset', name: 'Sunset', color: '#e63946' },
    { id: 'forest', name: 'Forest', color: '#2a9d8f' },
    { id: 'lavender', name: 'Lavender', color: '#7209b7' }
];

// Get base theme (light/dark) from localStorage
const getBaseThemeFromLocalStorage = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }
    const theme = localStorage.getItem('base-theme');
    return theme ? theme : 'light';
};

// Get custom theme from localStorage
const getCustomThemeFromLocalStorage = () => {
    if (typeof window === 'undefined') {
        return 'default';
    }
    const customTheme = localStorage.getItem('custom-theme');
    return customTheme ? customTheme : 'default';
};

export const ThemeContextProvider = ({ children }) => {
    // Base theme (light/dark)
    const [theme, setTheme] = useState(getBaseThemeFromLocalStorage());
    // Custom theme (default, ocean, sunset, etc.)
    const [customTheme, setCustomTheme] = useState(getCustomThemeFromLocalStorage());

    // Initialize window width state
    const [rawWindowWidth, setRawWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    // Apply debounce to window width calculations 
    const windowWidth = useDebounce(rawWindowWidth, 5);

    // Toggle between light/dark mode
    const toggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    // Set a custom theme
    const setThemePreference = (themeId) => {
        setCustomTheme(themeId);
        
        // Apply the theme class to the body
        if (typeof document !== 'undefined') {
            // Remove any existing theme classes
            document.body.classList.remove(...themeOptions.map(t => `theme-${t.id}`));
            
            // Add the new theme class if not default
            if (themeId !== 'default') {
                document.body.classList.add(`theme-${themeId}`);
            }
        }
    };

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

    // Persist base theme (light/dark) in localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('base-theme', theme);
        }
    }, [theme]);
    
    // Persist custom theme in localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('custom-theme', customTheme);
            
            // Apply the saved theme on initial load
            if (customTheme !== 'default') {
                document.body.classList.add(`theme-${customTheme}`);
            }
        }
    }, [customTheme]);    return (
        <ThemeContext.Provider value={{ 
            theme, 
            setTheme, 
            toggle, 
            windowWidth, 
            customTheme, 
            setThemePreference,
            themeOptions 
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext; // Export ThemeContext after declaration