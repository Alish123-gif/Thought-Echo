"use client";
import React from 'react'
import styles from './authLinks.module.css'
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
                <Link className={styles.Item} href="/login" onClick={onLinkClick}>Login</Link>
            ) : (
                <>
                    <span className={styles.Item} onClick={handleLogout}>Logout</span>
                </>
            )}
        </>
    )
}

export default AuthLinks