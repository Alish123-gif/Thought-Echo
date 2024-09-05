"use client"
import React, { useState } from 'react'
import styles from './navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa';
import { TbSocial } from "react-icons/tb";
import { AuthLinks, ThemeToggle } from '..';
import Link from 'next/link';
import Image from 'next/image';
const DropDown = ({ children }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (
        <>
            <div className={styles.dropdown}>
                <button onClick={toggleDropdown} className={`${styles.menuButton} ${isDropdownOpen ? styles.open : ''}`}>
                    <TbSocial />
                </button>
                {isDropdownOpen && (
                    <div className={styles.dropdownContent}>
                        <a href="www.facebook.com"><Image src="/x.png" alt="x" width={24} height={24} /><span>X</span></a>
                        <a herf="instagram.com"><Image src="/instagram.png" alt="instagram" width={24} height={24} /><span>instagram</span></a>
                        <a herf="linkedin.com"><Image src="/linkedin.png" alt="linkedin" width={24} height={24} /><span>linkdIn</span></a>
                        <a herf="tiktok.com"><Image src="/tiktok.png" alt="tiktok" width={24} height={24} /><span>tiktok</span></a>
                    </div>
                )}
            </div>
            {children}
            <div className={styles.dropdown}>
                <button
                    onClick={toggleDropdown}
                    className={`${styles.menuButton} ${isDropdownOpen ? styles.open : ''}`}
                >
                    {isDropdownOpen ? <FaTimes /> : <FaBars />}
                </button>
                {isDropdownOpen && (
                    <div className={`${styles.dropdownContent} ${styles.right}`}>
                        <ThemeToggle />
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                        <AuthLinks />
                    </div>
                )}

            </div>
        </>
    )
}

export default DropDown