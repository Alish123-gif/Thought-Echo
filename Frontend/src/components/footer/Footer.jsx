import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { HiMail, HiLocationMarker, HiHeart } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Brand Section */}
                    <div className={styles.brandSection}>
                        <div className={styles.logo}>
                            <Image src="/logo.png" alt="ThoughtEcho" width={50} height={50} />
                            <h2 className={styles.logoText}>ThoughtEcho</h2>
                        </div>                        <p className={styles.brandDescription}>
                            A full-stack developer&apos;s journey through code, creativity, and innovation.
                            Sharing insights from Lebanon to the world.
                        </p>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <HiLocationMarker className={styles.contactIcon} />
                                <span>Lebanon</span>
                            </div>
                            <div className={styles.contactItem}>
                                <HiMail className={styles.contactIcon} />
                                <a href="mailto:alishibli372@gmail.com">alishibli372@gmail.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.linksSection}>
                        <h3 className={styles.sectionTitle}>Quick Links</h3>
                        <nav className={styles.linksList}>
                            <Link href="/" className={styles.footerLink}>Home</Link>
                            <Link href="/about" className={styles.footerLink}>About</Link>
                            <Link href="/posts" className={styles.footerLink}>Blog</Link>
                            <Link href="/contact" className={styles.footerLink}>Contact</Link>
                        </nav>
                    </div>

                    {/* Categories */}
                    <div className={styles.linksSection}>
                        <h3 className={styles.sectionTitle}>Categories</h3>
                        <nav className={styles.linksList}>
                            <Link href="/posts?category=coding" className={styles.footerLink}>Coding</Link>
                            <Link href="/posts?category=technology" className={styles.footerLink}>Technology</Link>
                            <Link href="/posts?category=tutorials" className={styles.footerLink}>Tutorials</Link>
                            <Link href="/posts?category=insights" className={styles.footerLink}>Insights</Link>
                        </nav>
                    </div>

                    {/* Social and Newsletter */}
                    <div className={styles.socialSection}>
                        <h3 className={styles.sectionTitle}>Connect</h3>
                        <div className={styles.socialLinks}>
                            <a
                                href="https://github.com/ali"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="GitHub"
                            >
                                <FaGithub />
                            </a>                            <a
                                href="https://linkedin.com/in/ali"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://twitter.com/ali"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Twitter"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="https://instagram.com/ali"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                        </div>

                        <div className={styles.newsletter}>
                            <p className={styles.newsletterText}>
                                Stay updated with the latest posts and insights
                            </p>
                            <div className={styles.newsletterForm}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={styles.emailInput}
                                />
                                <button className={styles.subscribeButton}>Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <div className={styles.bottomContent}>
                        <div className={styles.copyright}>
                            <p>
                                © {currentYear} ThoughtEcho. Made with{" "}
                                <HiHeart className={styles.heartIcon} />{" "}
                                by Ali
                            </p>
                        </div>
                        <div className={styles.bottomLinks}>
                            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
                            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
                            <Link href="/sitemap" className={styles.bottomLink}>Sitemap</Link>
                        </div>
                    </div>
                </div>            </div>
        </footer>
    );
};

export default Footer;