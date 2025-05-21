"use client";
import React from 'react';
import Link from 'next/link';
import styles from './userLinks.module.css';
import { HiUser, HiBookmark, HiHeart, HiChatAlt } from 'react-icons/hi';

const UserLinks = ({ className = '' }) => {
    return (
        <div className={`${styles.userLinks} ${className}`}>
            <Link href="/profile" className={styles.userLink}>
                <HiUser /> Profile
            </Link>
            <Link href="/bookmarks" className={styles.userLink}>
                <HiBookmark /> Saved Posts
            </Link>
            <Link href="/favorites" className={styles.userLink}>
                <HiHeart /> Favorites
            </Link>
            <Link href="/comments" className={styles.userLink}>
                <HiChatAlt /> My Comments
            </Link>
        </div>
    );
};

export default UserLinks;
