"use client"
import React, { useState, useEffect, useContext } from 'react'
import styles from './navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa';
import { HiHome, HiInformationCircle, HiMail, HiUser, HiShieldCheck, HiPencilAlt, HiViewList, HiUserGroup, HiChartBar } from "react-icons/hi";
import { AuthLinks, ThemeToggle, AdminLinks, UserLinks } from '..';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ThemeContext from '@/context/ThemeContext';

const DropDown = ({ children }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    // Get windowWidth from ThemeContext instead of tracking it locally
    const { windowWidth } = useContext(ThemeContext);

    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.iconContainer}`) &&
                !event.target.closest(`.${styles.dropdown}`)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen, styles.iconContainer, styles.dropdown]);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div className={styles.iconContainer}>
                <button onClick={toggleDropdown} className={`${styles.menuButton} ${isDropdownOpen ? styles.open : ''}`}>
                    {isDropdownOpen ? <FaTimes /> : <FaBars />}
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
                <div className={styles.dropdown}>                    <div className={styles.dropdownContent}>
                    <ThemeToggle className={styles.dropdownItem} />

                    {/* Show different items based on route */}
                    {session?.user?.isAdmin && pathname?.startsWith('/admin') ? (
                        <>
                            <Link className={styles.dropdownItem} href="/admin">
                                <HiShieldCheck /> Dashboard
                            </Link>
                            <Link className={styles.dropdownItem} href="/admin/write">
                                <HiPencilAlt /> Write Post
                            </Link>
                            <Link className={styles.dropdownItem} href="/admin/posts">
                                <HiViewList /> All Posts
                            </Link>
                            <Link className={styles.dropdownItem} href="/admin/users">
                                <HiUserGroup /> Users
                            </Link>
                            <Link className={styles.dropdownItem} href="/">
                                <HiHome /> Back to Site
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className={styles.dropdownItem} href="/">
                                <HiHome /> Home
                            </Link>
                            <Link className={styles.dropdownItem} href="/about">
                                <HiInformationCircle /> About
                            </Link>
                            <Link className={styles.dropdownItem} href="/contact">
                                <HiMail /> Contact
                            </Link>
                            {session?.user?.isAdmin && (
                                <>
                                    <Link className={styles.dropdownItem} href="/admin">
                                        <HiShieldCheck /> Admin Dashboard
                                    </Link>
                                    <div className={`${styles.dropdownSubMenu}`}>
                                        <AdminLinks className={styles.dropdownItem} />
                                    </div>
                                </>
                            )}

                            {session?.user && !session?.user?.isAdmin && (
                                <>
                                    <Link className={styles.dropdownItem} href="/profile">
                                        <HiUser /> Profile
                                    </Link>
                                    <div className={`${styles.dropdownSubMenu}`}>
                                        <UserLinks className={styles.dropdownItem} />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <AuthLinks className={styles.dropdownItem} />
                </div>
                    <div className={styles.dropdownSocail}>
                        <a className={styles.dropdownItem} href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <Image src="/x.png" alt="X" width={22} height={22} /><span>{windowWidth <= 640 ? "" : "X"}</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <Image src="/instagram.png" alt="Instagram" width={22} height={22} /><span>{windowWidth <= 640 ? "" : "Instagram"}</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <Image src="/linkedin.png" alt="LinkedIn" width={22} height={22} /><span>{windowWidth <= 640 ? "" : "LinkedIn"}</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                            <Image src="/tiktok.png" alt="TikTok" width={22} height={22} /><span>{windowWidth <= 640 ? "" : "TikTok"}</span>
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

export default DropDown;