"use client";
import React, { useState, useEffect, useContext } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { AuthLinks, ThemeToggle, AdminLinks, UserLinks } from '..';
import DropDown from './DropDown';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { HiHome } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import ThemeContext from '@/context/ThemeContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();
    const { windowWidth } = useContext(ThemeContext);

    // Effect for scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (<div className={`${styles.container} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.social}>
            <a
                href="https://x.com/AliShibli13"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
            >
                <FaTwitter />
            </a>
            <a
                href="https://www.instagram.com/_ali_shibli/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
            >
                <FaInstagram />
            </a>
            <a
                href="https://www.linkedin.com/in/ali-shibli-573483245/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
            >
                <FaLinkedin />
            </a>
            <a
                href="https://github.com/Alish123-gif"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
            >
                <FaGithub />
            </a>
        </div>

        <DropDown>
            <Link href="/" className={styles.logo}>ThoughtEcho</Link>
        </DropDown>            <div className={styles.links}>
            <ThemeToggle />

            {/* Show admin links directly in admin pages */}
            {session?.user?.isAdmin && pathname?.startsWith('/admin') ? (
                <>
                    <Link href="/admin" className={pathname === '/admin' ? styles.activeLink : ''}>
                        Dashboard
                    </Link>
                    <Link href="/admin/write" className={pathname === '/admin/write' ? styles.activeLink : ''}>
                        Write Post
                    </Link>
                    <Link href="/admin/posts" className={pathname === '/admin/posts' ? styles.activeLink : ''}>
                        All Posts
                    </Link>
                    <Link href="/admin/settings" className={pathname === '/admin/settings' ? styles.activeLink : ''}>
                        Settings
                    </Link>
                    <Link href="/" className={styles.homeLink}>
                        <HiHome />
                        <span className={styles.homeLinkText}>{windowWidth <= 1024 ? "" : "Back to Site"}</span>
                    </Link>
                </>
            ) : (
                <>
                    {/* Regular navigation */}
                    <Link href="/" className={pathname === '/' ? styles.activeLink : ''}>Home</Link>
                    <Link href="/posts" className={pathname === '/posts' ? styles.activeLink : ''}>All Posts</Link>
                    <Link href="/about" className={pathname === '/about' ? styles.activeLink : ''}>About Us</Link>

                    {/* Admin dropdown for non-admin pages */}
                    {session?.user?.isAdmin && (
                        <div className={styles.adminContainer}>
                            <Link href="/admin" className={styles.adminLink}>
                                Admin
                                <span className={styles.adminBadge}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                                    </svg>
                                </span>
                            </Link>
                            <div className={styles.adminLinksPopup}>
                                <AdminLinks />
                            </div>
                        </div>
                    )}

                    {/* User dropdown for logged in users */}
                    {session?.user && !session.user.isAdmin && (
                        <div className={styles.userContainer}>
                            <Link href="/profile" className={styles.userLink}>
                                Profile
                            </Link>
                            <div className={styles.userLinksPopup}>
                                <UserLinks />
                            </div>
                        </div>
                    )}
                </>
            )}

            <AuthLinks />
        </div>
    </div>
    );
};

export default Navbar;