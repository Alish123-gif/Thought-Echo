import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { HiMail, HiLocationMarker, HiHeart } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { getCategories } from "@/utils/categoryService";

const Footer = async () => {
    const currentYear = new Date().getFullYear();
    const Categories = await getCategories();
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
                            Full-stack developer sharing insights on code, creativity, and innovation.
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

                    {/* Quick Links and Categories in a row */}
                    <div className={styles.linksRow}>
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
                                {Categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/posts?category=${category.slug}`}
                                        className={styles.footerLink}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Social and Newsletter */}
                    <div className={styles.socialSection}>
                        <h3 className={styles.sectionTitle}>Connect</h3>
                        <div className={styles.socialLinks}>
                            <a
                                href="https://github.com/Alish123-gif"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="GitHub"
                            >
                                <FaGithub />
                            </a>                            <a
                                href="https://www.linkedin.com/in/ali-shibli-573483245/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://x.com/AliShibli13"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Twitter"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="https://www.instagram.com/_ali_shibli/"
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
                            </p>                            <div className={styles.newsletterForm}>
                                <input
                                    type="email"
                                    placeholder="Your email"
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