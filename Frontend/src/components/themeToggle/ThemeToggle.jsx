"use client";
import React, { useContext } from 'react'
import styles from './themeToggle.module.css'
import Image from 'next/image';
import ThemeContext from '@/context/ThemeContext';
const ThemeToggle = ({ onToggle }) => {
    const { toggle, theme } = useContext(ThemeContext);

    const handleToggle = () => {
        toggle();
        if (onToggle) onToggle();
    };

    return (
        <div className={styles.container} onClick={handleToggle} >
            {theme === "dark" ?
                <Image src="/moon.png" alt="moon" width={14} height={14} />
                :
                <Image src="/sun.png" alt="sun" width={14} height={14} />
            }
        </div>
    )
}

export default ThemeToggle