"use client";
import React from 'react';
import Link from 'next/link';
import styles from './userLinks.module.css';
import { HiUser, HiBookmark, HiHeart, HiChatAlt } from 'react-icons/hi';

const UserLinks = ({ className = '', onLinkClick }) => {
    return (
        <div className={`${styles.userLinks} ${className}`}>
            <Link href="/profile" className={styles.userLink} onClick={onLinkClick}>
                <HiUser /> Profile
            </Link>
            <Link href="/bookmarks" className={styles.userLink} onClick={onLinkClick}>
                <HiBookmark /> Saved Posts
            </Link>
            <Link href="/favorites" className={styles.userLink} onClick={onLinkClick}>
                <HiHeart /> Favorites
            </Link>
            <Link href="/comments" className={styles.userLink} onClick={onLinkClick}>
                <HiChatAlt /> My Comments
            </Link>
        </div>
    );
};

export default UserLinks;
