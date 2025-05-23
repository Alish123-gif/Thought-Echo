"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './settings.module.css';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import CategoriesSettings from '@/components/settings/CategoriesSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';
import ContentSettings from '@/components/settings/ContentSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import SeoSettings from '@/components/settings/SeoSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState('categories');
    const [loading, setLoading] = useState(true);
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const renderActiveSection = () => {
        switch (activeSection) {
            case 'categories':
                return <CategoriesSettings />;
            case 'general':
                return <GeneralSettings />;
            case 'content':
                return <ContentSettings />;
            case 'appearance':
                return <AppearanceSettings />;
            case 'seo':
                return <SeoSettings />;
            case 'security':
                return <SecuritySettings />;
            default:
                return <CategoriesSettings />;
        }
    };    // Check if user is admin and redirect if not
    useEffect(() => {
        if (!isLoading) {
            setLoading(false);
            console.log('User object:', user);
            console.log('Is user admin?', user?.isAdmin);
            console.log('Is Authenticated:', isAuthenticated);

            if (!isAuthenticated) {
                console.log('Not authenticated, redirecting...');
                router.push('/login?callbackUrl=' + encodeURIComponent('/admin/settings'));
                return;
            }

            if (!user?.isAdmin) {
                console.log('Not admin, redirecting...');
                router.push('/');
                return;
            }
        }
    }, [user, isLoading, isAuthenticated, router]); if (isLoading || loading) {
        return (
            <div className={styles.loadingContainer}>
                <LoadingSpinner />
            </div>
        );
    } if (!isAuthenticated || !user?.isAdmin) {
        // Show a more helpful message
        return (
            <div className={styles.unauthorized}>
                <h2>Access Denied</h2>
                <p>You need admin privileges to view this page.</p>
                <button onClick={() => router.push('/')}>
                    Return to Homepage
                </button>
            </div>
        );
    }

    return (
        <div className={styles.settingsContainer}>
            <h1 className={styles.settingsTitle}>Admin Settings</h1>
            <div className={styles.settingsContent}>
                <SettingsSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <div className={styles.settingsMainContent}>
                    {renderActiveSection()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
