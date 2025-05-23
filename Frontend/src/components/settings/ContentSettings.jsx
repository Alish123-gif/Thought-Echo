"use client";
import React from 'react';
import styles from './settings_components.module.css';

const ContentSettings = () => {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>Content Settings</h2>
            <p className={styles.placeholderText}>
                This section will include default post settings, comment moderation, RSS configuration, and media handling preferences.
            </p>
            <div className={styles.comingSoon}>Coming Soon</div>
        </div>
    );
};

export default ContentSettings;
