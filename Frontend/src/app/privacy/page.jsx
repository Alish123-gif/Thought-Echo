import React from 'react';
import styles from './privacy.module.css';
import { HiShieldCheck, HiLockClosed, HiEye, HiDatabase } from 'react-icons/hi';

const PrivacyPolicyPage = () => {
    const lastUpdated = "December 2024";

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <HiShieldCheck className={styles.heroIcon} />
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.subtitle}>
                    Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
                <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <HiDatabase className={styles.sectionIcon} />
                        <h2>Information We Collect</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <h3>Personal Information</h3>
                        <ul>
                            <li>Name and email address when you create an account</li>
                            <li>Profile information you choose to provide</li>
                            <li>Comments and content you post on our blog</li>
                            <li>Communication when you contact us directly</li>
                        </ul>

                        <h3>Automatically Collected Information</h3>
                        <ul>
                            <li>IP address and browser information</li>
                            <li>Pages visited and time spent on our site</li>
                            <li>Referring websites and search terms</li>
                            <li>Device and operating system information</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <HiEye className={styles.sectionIcon} />
                        <h2>How We Use Your Information</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <ul>
                            <li>To provide and maintain our blog service</li>
                            <li>To personalize your experience on our site</li>
                            <li>To communicate with you about updates and new content</li>
                            <li>To improve our website and user experience</li>
                            <li>To prevent spam and abuse</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <HiLockClosed className={styles.sectionIcon} />
                        <h2>Data Protection & Security</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                        <ul>
                            <li>All data transmission is encrypted using HTTPS</li>
                            <li>Passwords are securely hashed and stored</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal data on a need-to-know basis</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Cookies and Tracking</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            We use cookies and similar tracking technologies to enhance your browsing experience:
                        </p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                        </ul>
                        <p>
                            You can control cookie settings through your browser preferences.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Third-Party Services</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            We may use third-party services that collect information:
                        </p>
                        <ul>
                            <li><strong>Google Analytics:</strong> For website analytics and insights</li>
                            <li><strong>Social Media Platforms:</strong> For authentication and sharing features</li>
                            <li><strong>Email Services:</strong> For sending newsletters and notifications</li>
                            <li><strong>CDN Services:</strong> For faster content delivery</li>
                        </ul>
                        <p>
                            These services have their own privacy policies and data practices.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Your Rights</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            You have the following rights regarding your personal information:
                        </p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                            <li><strong>Portability:</strong> Receive your data in a portable format</li>
                            <li><strong>Objection:</strong> Object to certain types of processing</li>
                        </ul>
                        <p>
                            To exercise these rights, please contact us at alishibli372@example.com
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Data Retention</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            We retain your personal information only as long as necessary for the purposes outlined in this policy:
                        </p>
                        <ul>
                            <li>Account information: Until you delete your account</li>
                            <li>Blog posts and comments: Until you delete them or your account</li>
                            <li>Analytics data: Up to 26 months</li>
                            <li>Communication records: Up to 3 years</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Contact Information</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            If you have questions about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className={styles.contactInfo}>
                            <p><strong>Email:</strong> alishibli372@example.com</p>
                            <p><strong>Website:</strong> thoughtecho.netlify.app</p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Changes to This Policy</h2>
                    </div>
                    <div className={styles.sectionContent}>                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                        </p>
                        <p>
                            We encourage you to review this Privacy Policy periodically for any changes.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
