import React from 'react';
import styles from './contact.module.css';
import { HiMail, HiLocationMarker, HiPhone, HiClock } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const ContactPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Get In Touch</h1>
                <p className={styles.subtitle}>
                    Have a question, want to collaborate, or just say hello? I'd love to hear from you.
                </p>
            </div>

            <div className={styles.content}>
                <div className={styles.contactInfo}>
                    <h2 className={styles.sectionTitle}>Contact Information</h2>
                    
                    <div className={styles.contactCard}>
                        <div className={styles.contactItem}>
                            <HiMail className={styles.icon} />
                            <div>
                                <h3>Email</h3>
                                <a href="mailto:alishibli372@example.com">alishibli372@example.com</a>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <HiLocationMarker className={styles.icon} />
                            <div>
                                <h3>Location</h3>
                                <p>Lebanon</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <HiClock className={styles.icon} />
                            <div>
                                <h3>Response Time</h3>
                                <p>Usually within 24 hours</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.socialSection}>
                        <h3>Connect on Social Media</h3>
                        <div className={styles.socialLinks}>
                            <a href="https://github.com/ali" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <FaGithub />
                                <span>GitHub</span>
                            </a>
                            <a href="https://linkedin.com/in/ali" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <FaLinkedin />
                                <span>LinkedIn</span>
                            </a>
                            <a href="https://twitter.com/ali" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                <FaTwitter />
                                <span>Twitter</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.contactForm}>
                    <h2 className={styles.sectionTitle}>Send a Message</h2>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Your name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                required
                                placeholder="What's this about?"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                required
                                placeholder="Your message here..."
                            ></textarea>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            <div className={styles.cta}>
                <h2>Let's Build Something Amazing Together</h2>
                <p>Whether it's a complex web application or a simple landing page, I'm here to help bring your ideas to life.</p>
            </div>
        </div>
    );
};

export default ContactPage;
