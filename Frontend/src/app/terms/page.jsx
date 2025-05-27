import React from 'react';
import styles from './terms.module.css';
import { HiDocument, HiExclamation, HiUserGroup, HiScale } from 'react-icons/hi';

const TermsOfServicePage = () => {
    const lastUpdated = "December 2024";

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <HiDocument className={styles.heroIcon} />
                <h1 className={styles.title}>Terms of Service</h1>
                <p className={styles.subtitle}>
                    These terms govern your use of our blog and services. Please read them carefully.
                </p>
                <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <HiUserGroup className={styles.sectionIcon} />
                        <h2>Acceptance of Terms</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            By accessing and using ThoughtEcho, you accept and agree to be bound by the terms and provision of this agreement. 
                            If you do not agree to abide by the above, please do not use this service.
                        </p>
                        <p>
                            These Terms of Service ("Terms") apply to your access and use of ThoughtEcho (the "Service") 
                            operated by Ali Shibli ("we", "us", or "our").
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>User Accounts</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                        </p>
                        <ul>
                            <li>You are responsible for safeguarding your password and all activities under your account</li>
                            <li>You must immediately notify us of any unauthorized use of your account</li>
                            <li>We reserve the right to terminate accounts that violate these terms</li>
                            <li>One person or legal entity may not maintain more than one account</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Acceptable Use</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            You agree to use our service only for lawful purposes and in accordance with these Terms.
                        </p>
                        
                        <h3>You agree NOT to:</h3>
                        <ul>
                            <li>Post content that is illegal, harmful, threatening, abusive, or discriminatory</li>
                            <li>Impersonate any person or entity or misrepresent your affiliation</li>
                            <li>Upload or transmit viruses, malware, or other malicious code</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Spam, harass, or send unsolicited communications to other users</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe upon intellectual property rights of others</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Content and Intellectual Property</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <h3>Your Content</h3>
                        <ul>
                            <li>You retain ownership of content you post on our platform</li>
                            <li>By posting content, you grant us a worldwide, non-exclusive license to use, display, and distribute your content</li>
                            <li>You represent that you have the right to post the content and it doesn't violate any third-party rights</li>
                            <li>We reserve the right to remove content that violates these terms</li>
                        </ul>

                        <h3>Our Content</h3>
                        <ul>
                            <li>All content on our platform (except user-generated content) is owned by us or our licensors</li>
                            <li>You may not reproduce, distribute, or create derivative works without permission</li>
                            <li>Our trademarks and logos may not be used without written consent</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <HiExclamation className={styles.sectionIcon} />
                        <h2>Privacy and Data</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.
                        </p>
                        <ul>
                            <li>We collect and process data as described in our Privacy Policy</li>
                            <li>You consent to the collection and use of your information as outlined</li>
                            <li>We implement security measures to protect your data</li>
                            <li>You have rights regarding your personal data as described in our Privacy Policy</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Service Availability</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            While we strive to maintain high availability, we cannot guarantee uninterrupted service.
                        </p>
                        <ul>
                            <li>The service is provided "as is" without warranties of any kind</li>
                            <li>We may modify, suspend, or discontinue the service at any time</li>
                            <li>We are not responsible for any loss of data or content</li>
                            <li>Regular maintenance may temporarily affect service availability</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <HiScale className={styles.sectionIcon} />
                        <h2>Limitation of Liability</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, 
                            special, consequential, or punitive damages.
                        </p>
                        <ul>
                            <li>Our total liability shall not exceed the amount you paid for the service</li>
                            <li>We are not responsible for user-generated content or third-party links</li>
                            <li>You use the service at your own risk</li>
                            <li>Some jurisdictions may not allow certain limitations of liability</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Termination</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            Either party may terminate this agreement at any time.
                        </p>
                        <ul>
                            <li>You may delete your account at any time through your account settings</li>
                            <li>We may terminate or suspend your account for violations of these terms</li>
                            <li>Upon termination, your access to the service will cease immediately</li>
                            <li>Certain provisions of these terms will survive termination</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Governing Law</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of Lebanon, 
                            without regard to its conflict of law provisions.
                        </p>
                        <p>
                            Any disputes arising from these terms or your use of the service shall be resolved through 
                            binding arbitration or in the courts of Lebanon.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Changes to Terms</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users of any material changes.
                        </p>
                        <ul>
                            <li>Changes will be posted on this page with an updated "Last updated" date</li>
                            <li>Continued use of the service after changes constitutes acceptance</li>
                            <li>If you disagree with changes, you should discontinue use of the service</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Contact Information</h2>
                    </div>
                    <div className={styles.sectionContent}>
                        <p>
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className={styles.contactInfo}>
                            <p><strong>Email:</strong> alishibli372@example.com</p>
                            <p><strong>Website:</strong> thoughtecho.netlify.app</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
