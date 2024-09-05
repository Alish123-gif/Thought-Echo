"use client";
import React, { useContext } from 'react'
import styles from './themeToggle.module.css'
import Image from 'next/image';
import ThemeContext from '@/context/ThemeContext';
const ThemeToggle = () => {
    const { toggle, theme } = useContext(ThemeContext);
    return (
        <div className={styles.container} onClick={toggle} >
            <Image src="/moon.png" alt="moon" width={14} height={14} />
            <div className={styles.ball}></div>
            <Image src="/sun.png" alt="sun" width={14} height={14} />

        </div>
    )
}

export default ThemeToggle