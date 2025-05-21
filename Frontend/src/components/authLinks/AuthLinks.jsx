"use client";
import React from 'react'
import styles from './authLinks.module.css'
import navbarStyles from '../navbar/navbar.module.css'
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AuthLinks = () => {
    const { isAuthenticated, user, logout } = useAuth();
    return (
        <>
            {!isAuthenticated ? (
                <Link className={navbarStyles.dropdownItem} href="/login">Login</Link>
            ) : (
                <>
                    <span className={navbarStyles.dropdownItem} onClick={logout}>Logout</span>
                </>
            )}
        </>
    )
}

export default AuthLinks