"use client";
import React from 'react';
import styles from './settings_components.module.css';

const GeneralSettings = () => {
    return (
        <div className={styles.settingsSection}>
            <h2 className={styles.sectionTitle}>General Settings</h2>
            <p className={styles.placeholderText}>
                This section will include site name, description, language, timezone, logo, and contact information settings.
            </p>
            <div className={styles.comingSoon}>Coming Soon</div>
        </div>
    );
};

export default GeneralSettings;
