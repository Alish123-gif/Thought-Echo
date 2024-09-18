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
            <div className={styles.iconContainer}>
                <button onClick={toggleDropdown} className={`${styles.menuButton} ${isDropdownOpen ? styles.open : ''}`}>
                    <TbSocial />
                </button>
                {children}
                <button
                    onClick={toggleDropdown}
                    className={`${styles.menuButton} ${isDropdownOpen ? styles.open : ''}`}
                >
                    {isDropdownOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {isDropdownOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                        <ThemeToggle className={styles.dropdownItem} />
                        <Link className={styles.dropdownItem} href="/">Home</Link>
                        <Link className={styles.dropdownItem} href="/about">About</Link>
                        <Link className={styles.dropdownItem} href="/contact">Contact</Link>
                        <AuthLinks className={styles.dropdownItem} />
                    </div>
                    <div className={styles.dropdownSocail}>
                        <a className={styles.dropdownItem} href="https://www.facebook.com">
                            <Image src="/x.png" alt="x" width={24} height={24} /><span>X</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.instagram.com">
                            <Image src="/instagram.png" alt="instagram" width={24} height={24} /><span>Instagram</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.linkedin.com">
                            <Image src="/linkedin.png" alt="linkedin" width={24} height={24} /><span>LinkedIn</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.tiktok.com">
                            <Image src="/tiktok.png" alt="tiktok" width={24} height={24} /><span>TikTok</span>
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

export default DropDown;