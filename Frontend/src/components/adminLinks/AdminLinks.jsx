"use client";
import React from 'react';
import Link from 'next/link';
import styles from './adminLinks.module.css';
import { HiPencilAlt, HiViewList, HiUserGroup, HiCog, HiChartBar, HiUser } from 'react-icons/hi';

const AdminLinks = ({ className = '', onLinkClick }) => {
    return (
        <div className={`${styles.adminLinks} ${className}`}>
            <Link href="/admin/write" className={styles.adminLink} onClick={onLinkClick}>
                <HiPencilAlt /> Write Post
            </Link>
            <Link href="/admin/posts" className={styles.adminLink} onClick={onLinkClick}>
                <HiViewList /> All Posts
            </Link>
            <Link href="/admin/analytics" className={styles.adminLink} onClick={onLinkClick}>
                <HiChartBar /> Dashboard
            </Link>
            <Link href="/profile" className={styles.adminLink} onClick={onLinkClick}>
                <HiUser /> Profile
            </Link>
            <Link href="/admin/settings" className={styles.adminLink} onClick={onLinkClick}>
                <HiCog /> Settings
            </Link>
        </div>
    );
};

export default AdminLinks;
