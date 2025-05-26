"use client";
import React from 'react';
import Link from 'next/link';
import styles from './adminLinks.module.css';
import { HiPencilAlt, HiViewList, HiUserGroup, HiCog, HiChartBar } from 'react-icons/hi';

const AdminLinks = ({ className = '' }) => {
    return (
        <div className={`${styles.adminLinks} ${className}`}>
            <Link href="/admin/write" className={styles.adminLink}>
                <HiPencilAlt /> Write Post
            </Link>
            <Link href="/admin/posts" className={styles.adminLink}>
                <HiViewList /> All Posts
            </Link>
            <Link href="/admin/analytics" className={styles.adminLink}>
                <HiChartBar /> Dashboard
            </Link>
            <Link href="/admin/settings" className={styles.adminLink}>
                <HiCog /> Settings
            </Link>
        </div>
    );
};

export default AdminLinks;
