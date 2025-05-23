"use client";

import React from 'react';
import Link from 'next/link';
import { WriteBlogForm, AdminLinks } from '@/components';
import styles from './write.module.css';
import { HiArrowLeft } from 'react-icons/hi';

const WritePage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin" className={styles.backLink}>
                    <HiArrowLeft />
                    <span>Back to Dashboard</span>
                </Link>
            </div>
            <WriteBlogForm />
        </div>
    )
}

export default WritePage