"use client"
import React, { useState, useEffect, useContext } from 'react'
import styles from './navbar.module.css'
import { FaBars, FaTimes, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiHome, HiInformationCircle, HiMail, HiUser, HiShieldCheck, HiPencilAlt, HiViewList, HiUserGroup, HiChartBar } from "react-icons/hi";
import { AuthLinks, ThemeToggle, AdminLinks, UserLinks } from '..';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ThemeContext from '@/context/ThemeContext';
import { Settings } from 'lucide-react';

const DropDown = ({ children }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    // Get windowWidth from ThemeContext instead of tracking it locally
    const { windowWidth } = useContext(ThemeContext); useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.iconContainer}`) &&
                !event.target.closest(`.${styles.dropdown}`)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]); const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
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
                <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                        <ThemeToggle className={styles.dropdownItem} onToggle={closeDropdown} />
                        {session?.user?.isAdmin && pathname?.startsWith('/admin') ? (
                            <>
                                <Link className={styles.dropdownItem} href="/admin" onClick={closeDropdown}>
                                    <HiShieldCheck /> Dashboard
                                </Link>
                                <Link className={styles.dropdownItem} href="/admin/write" onClick={closeDropdown}>
                                    <HiPencilAlt /> Write Post
                                </Link>
                                <Link className={styles.dropdownItem} href="/admin/posts" onClick={closeDropdown}>
                                    <HiViewList /> All Posts
                                </Link>
                                <Link className={styles.dropdownItem} href="/admin/settings" onClick={closeDropdown}>
                                    <Settings /> Settings
                                </Link>
                                <Link className={styles.dropdownItem} href="/" onClick={closeDropdown}>
                                    <HiHome /> Back to Site
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link className={styles.dropdownItem} href="/" onClick={closeDropdown}>
                                    <HiHome /> Home
                                </Link>
                                <Link className={styles.dropdownItem} href="/about" onClick={closeDropdown}>
                                    <HiInformationCircle /> About
                                </Link>
                                <Link className={styles.dropdownItem} href="/contact" onClick={closeDropdown}>
                                    <HiMail /> Contact
                                </Link>
                                {session?.user?.isAdmin && (
                                    <>
                                        <Link className={styles.dropdownItem} href="/admin" onClick={closeDropdown}>
                                            <HiShieldCheck /> Admin Dashboard
                                        </Link>
                                        <div className={`${styles.dropdownSubMenu}`}>
                                            <AdminLinks className={styles.dropdownItem} onLinkClick={closeDropdown} />
                                        </div>
                                    </>
                                )}

                                {session?.user && !session?.user?.isAdmin && (
                                    <>
                                        <Link className={styles.dropdownItem} href="/profile" onClick={closeDropdown}>
                                            <HiUser /> Profile
                                        </Link>
                                        <div className={`${styles.dropdownSubMenu}`}>
                                            <UserLinks className={styles.dropdownItem} onLinkClick={closeDropdown} />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <AuthLinks className={styles.dropdownItem} onLinkClick={closeDropdown} />
                    </div>
                    <div className={styles.dropdownSocail}>
                        <a className={styles.dropdownItem} href="https://x.com/AliShibli13" target="_blank" rel="noopener noreferrer">
                            <FaTwitter /><span>{windowWidth <= 640 ? "" : "X"}</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.instagram.com/_ali_shibli/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram /><span>{windowWidth <= 640 ? "" : "Instagram"}</span>
                        </a>
                        <a className={styles.dropdownItem} href="https://www.linkedin.com/in/ali-shibli-573483245/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin /><span>{windowWidth <= 640 ? "" : "LinkedIn"}</span>
                        </a>                        <a className={styles.dropdownItem} href="https://github.com/Alish123-gif" target="_blank" rel="noopener noreferrer">
                            <FaGithub /><span>{windowWidth <= 640 ? "" : "GitHub"}</span>
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

export default DropDown;