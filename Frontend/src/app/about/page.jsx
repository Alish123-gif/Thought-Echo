import styles from './about.module.css';
import Image from 'next/image';

const AboutPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.profileSection}>
                        <div className={styles.profileImage}>
                            <Image
                                src="/logo.png"
                                alt="Ali - Full Stack Developer"
                                width={150}
                                height={150}
                                className={styles.avatar}
                            />
                        </div>
                        <div className={styles.profileText}>
                            <h1 className={styles.title}>👋 About Me</h1>
                            <p className={styles.subtitle}>
                                Creating my way in the world, one line of code at a time
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <section className={styles.intro}>
                    <p className={styles.leadText}>
                        I&apos;m <strong>Ali</strong>, a full-stack web developer based in <strong>Lebanon</strong> with a strong technical edge,
                        a love for smart tools, and a passion for building things that actually work.
                    </p>

                    <p className={styles.description}>
                        I specialize in <strong>React</strong>, <strong>Next.js</strong>, <strong>Node.js</strong>, <strong>Express</strong>,
                        and modern backend integrations. I&apos;ve worked with Stripe, built complex API-based flows, handled deployment
                        and architecture decisions, and solved real-world bugs — not textbook ones.
                    </p>

                    <p className={styles.description}>
                        I&apos;m also the kind of developer who will rebuild their dev environment in the morning and troubleshoot
                        a broken NVMe bootloader in the afternoon. I don&apos;t just code — I debug, test, optimize, and push things
                        until they&apos;re solid.
                    </p>
                </section>

                <section className={styles.interests}>
                    <h2 className={styles.sectionTitle}>Beyond Development</h2>
                    <p className={styles.description}>
                        Beyond dev work, I explore creative tech ideas like:
                    </p>
                    <ul className={styles.interestsList}>
                        <li>🤖 AI-powered interfaces (still learning my way through this exciting space)</li>
                        <li>⚙️ Automated workflows using APIs and LLMs (constantly exploring new possibilities)</li>
                        <li>🚀 Performance tuning (from gaming rigs to backend logic)</li>
                    </ul>
                    <p className={styles.description}>
                        When I&apos;m not coding, I&apos;m thinking like a gamer — building, modding, experimenting. Whether it&apos;s
                        optimizing a PC build, role-playing in games like <strong>Baldur&apos;s Gate 3</strong>, or finding
                        the best GPU for the job, I like solving problems hands-on.
                    </p>
                </section>

                <section className={styles.services}>
                    <h2 className={styles.sectionTitle}>🔧 What I Do</h2>
                    <div className={styles.serviceGrid}>
                        <div className={styles.serviceCard}>
                            <h3>Full-Stack Web Development</h3>
                            <p>Frontend + Backend solutions that scale</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>Payment Integration</h3>
                            <p>Stripe, portals, subscriptions, and more</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>API Development</h3>
                            <p>Building and wiring APIs (Node.js, REST)</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>AI/LLM Integration</h3>
                            <p>AI-powered tool integration and automation</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>System Troubleshooting</h3>
                            <p>Hardware + software problem solving</p>
                        </div>
                        <div className={styles.serviceCard}>
                            <h3>Creative Development</h3>
                            <p>Innovative ideas with a technical twist</p>
                        </div>
                    </div>
                </section>

                <section className={styles.whyMe}>
                    <h2 className={styles.sectionTitle}>🎯 Why Work With Me?</h2>
                    <div className={styles.whyMeContent}>
                        <p className={styles.description}>
                            I&apos;m technical, fast, and no-nonsense. I don&apos;t just build what you ask for — I think about
                            what works, what scales, and what&apos;s worth your time.
                        </p>
                        <p className={styles.description}>
                            If you&apos;re looking for a developer who&apos;s comfortable going deep — whether that means backend logic,
                            AI integration, or real-world problem-solving — let&apos;s talk.
                        </p>
                        <div className={styles.motto}>
                            <p className={styles.mottoText}>
                                &quot;I&apos;m not just coding the present — I&apos;m creating my way in the world, building the future one project at a time.&quot;
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.cta}>
                    <h2 className={styles.ctaTitle}>Ready to build something amazing?</h2>
                    <p className={styles.ctaText}>
                        Let&apos;s turn your ideas into reality with clean code and smart solutions.
                    </p>
                    <div className={styles.contactButtons}>
                        <a href="mailto:alishibli372@gmail.com" className={styles.primaryButton}>
                            Get In Touch
                        </a>
                        <a href="/posts" className={styles.secondaryButton}>
                            Read My Blog
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
