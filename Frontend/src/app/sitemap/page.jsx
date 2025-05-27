import React from 'react';
import Link from 'next/link';
import styles from './sitemap.module.css';
import { HiMap, HiHome, HiUser, HiDocumentText, HiCog, HiShieldCheck } from 'react-icons/hi';

const SitemapPage = () => {
    const siteStructure = [
        {
            title: "Main Pages",
            icon: <HiHome />,
            links: [
                { name: "Home", url: "/", description: "Welcome page and latest blog posts" },
                { name: "About", url: "/about", description: "Learn more about Ali and his journey" },
                { name: "Blog Posts", url: "/posts", description: "All blog posts and articles" },
                { name: "Contact", url: "/contact", description: "Get in touch with Ali" },
            ]
        },
        {
            title: "Blog Categories",
            icon: <HiDocumentText />,
            links: [
                { name: "Coding", url: "/posts?category=coding", description: "Programming tutorials and insights" },
                { name: "Technology", url: "/posts?category=technology", description: "Tech trends and reviews" },
                { name: "Tutorials", url: "/posts?category=tutorials", description: "Step-by-step guides" },
                { name: "Insights", url: "/posts?category=insights", description: "Personal thoughts and analysis" },
            ]
        },
        {
            title: "User Account",
            icon: <HiUser />,
            links: [
                { name: "Login", url: "/login", description: "Sign in to your account" },
                { name: "Register", url: "/register", description: "Create a new account" },
                { name: "Profile", url: "/profile", description: "Manage your profile settings" },
            ]
        },
        {
            title: "Admin Panel",
            icon: <HiCog />,
            links: [
                { name: "Dashboard", url: "/admin", description: "Admin overview and analytics" },
                { name: "Write Post", url: "/admin/write", description: "Create new blog posts" },
                { name: "Manage Posts", url: "/admin/posts", description: "Edit and manage existing posts" },
                { name: "Settings", url: "/admin/settings", description: "Site configuration and settings" },
            ]
        },
        {
            title: "Legal & Policies",
            icon: <HiShieldCheck />,
            links: [
                { name: "Privacy Policy", url: "/privacy", description: "How we handle your data" },
                { name: "Terms of Service", url: "/terms", description: "Terms and conditions of use" },
                { name: "Sitemap", url: "/sitemap", description: "Site structure and navigation" },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <HiMap className={styles.heroIcon} />
                <h1 className={styles.title}>Sitemap</h1>
                <p className={styles.subtitle}>
                    Navigate through all pages and sections of ThoughtEcho. 
                    Find exactly what you're looking for with our comprehensive site structure.
                </p>
            </div>

            <div className={styles.content}>
                {siteStructure.map((section, index) => (
                    <section key={index} className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionIcon}>
                                {section.icon}
                            </div>
                            <h2 className={styles.sectionTitle}>{section.title}</h2>
                        </div>
                        
                        <div className={styles.linksGrid}>
                            {section.links.map((link, linkIndex) => (
                                <Link 
                                    key={linkIndex} 
                                    href={link.url} 
                                    className={styles.linkCard}
                                >
                                    <div className={styles.linkContent}>
                                        <h3 className={styles.linkTitle}>{link.name}</h3>
                                        <p className={styles.linkDescription}>{link.description}</p>
                                        <span className={styles.linkUrl}>{link.url}</span>
                                    </div>
                                    <div className={styles.linkArrow}>→</div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}

                <section className={styles.additionalInfo}>
                    <h2 className={styles.infoTitle}>Additional Information</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <h3>RSS Feed</h3>
                            <p>Stay updated with the latest posts through our RSS feed.</p>
                            <code>/api/rss</code>
                        </div>
                        <div className={styles.infoCard}>
                            <h3>API Endpoints</h3>
                            <p>Programmatic access to our content and data.</p>
                            <code>/api/*</code>
                        </div>
                        <div className={styles.infoCard}>
                            <h3>Search</h3>
                            <p>Find specific content across all blog posts and pages.</p>
                            <code>/posts?search=query</code>
                        </div>
                    </div>
                </section>

                <section className={styles.statistics}>
                    <h2 className={styles.statsTitle}>Site Statistics</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>25+</div>
                            <div className={styles.statLabel}>Pages</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>5</div>
                            <div className={styles.statLabel}>Categories</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>100%</div>
                            <div className={styles.statLabel}>Responsive</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>SEO</div>
                            <div className={styles.statLabel}>Optimized</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SitemapPage;
