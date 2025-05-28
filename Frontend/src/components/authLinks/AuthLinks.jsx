"use client";
import React from 'react'
import styles from './authLinks.module.css'
import navbarStyles from '../navbar/navbar.module.css'
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AuthLinks = ({ onLinkClick }) => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        if (onLinkClick) onLinkClick();
    };

    return (
        <>
            {!isAuthenticated ? (
                <Link className={navbarStyles.dropdownItem} href="/login" onClick={onLinkClick}>Login</Link>
            ) : (
                <>
                    <span className={navbarStyles.dropdownItem} onClick={handleLogout}>Logout</span>
                </>
            )}
        </>
    )
}

export default AuthLinks