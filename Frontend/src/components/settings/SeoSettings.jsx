"use client";
import React from 'react';
import styles from './settings_components.module.css';

const SeoSettings = () => {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>SEO & Analytics Settings</h2>
            <p className={styles.placeholderText}>
                This section will include meta tags defaults, social sharing configuration,
                Google Analytics/Search Console integration, and sitemap settings.
            </p>
            <div className={styles.comingSoon}>Coming Soon</div>
        </div>
    );
};

export default SeoSettings;
