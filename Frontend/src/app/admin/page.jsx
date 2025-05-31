"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaCog, FaFileAlt, FaUsers, FaChartBar, FaEdit } from 'react-icons/fa';
import styles from './admin.module.css';

const AdminDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/admin');
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Admin Dashboard</h1>
                <p>Welcome back, {session?.user?.name || 'Admin'}!</p>
            </div>

            <div className={styles.dashboardGrid}>
                <Link href="/admin/write" className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <FaPlus />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>Write New Post</h3>
                        <p>Create a new blog post</p>
                    </div>
                </Link>

                <Link href="/admin/posts" className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <FaFileAlt />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>Manage Posts</h3>
                        <p>View and edit existing posts</p>
                    </div>
                </Link>

                <Link href="/admin/settings" className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <FaCog />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>Settings</h3>
                        <p>Configure blog settings</p>
                    </div>
                </Link>

                <div className={styles.dashboardCard}>
                    <div className={styles.cardIcon}>
                        <FaChartBar />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>Analytics</h3>
                        <p>Coming soon...</p>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionsList}>
                    <Link href="/admin/write" className={styles.actionButton}>
                        <FaEdit /> Quick Draft
                    </Link>
                    <Link href="/admin/posts" className={styles.actionButton}>
                        <FaFileAlt /> View All Posts
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;