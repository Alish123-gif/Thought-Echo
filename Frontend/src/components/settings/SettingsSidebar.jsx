"use client";
import React from 'react';
import styles from './settings_components.module.css';
import {
    HiTag,
    HiCog,
    HiDocumentText,
    HiColorSwatch,
    HiSearchCircle,
    HiShieldCheck
} from 'react-icons/hi';

const SettingsSidebar = ({ activeSection, setActiveSection }) => {
    const sections = [
        { id: 'categories', label: 'Categories', icon: <HiTag /> },
        { id: 'general', label: 'General', icon: <HiCog /> },
        { id: 'content', label: 'Content', icon: <HiDocumentText /> },
        { id: 'appearance', label: 'Appearance', icon: <HiColorSwatch /> },
        { id: 'seo', label: 'SEO & Analytics', icon: <HiSearchCircle /> },
        { id: 'security', label: 'Security & Privacy', icon: <HiShieldCheck /> },
    ];

    return (
        <div className={styles.sidebar}>
            <ul className={styles.sidebarList}>
                {sections.map(section => (
                    <li
                        key={section.id}
                        className={`${styles.sidebarItem} ${activeSection === section.id ? styles.active : ''}`}
                        onClick={() => setActiveSection(section.id)}
                    >
                        <span className={styles.sidebarIcon}>{section.icon}</span>
                        {section.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SettingsSidebar;
