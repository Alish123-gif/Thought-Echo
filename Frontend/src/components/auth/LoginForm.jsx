"use client";
import styles from './auth.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { credentialsLogin, socialLogin } from '@/utils/api';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'session-expired') {
            setInfo("Your session has expired. Please log in again.");
        } else if (message === 'invalid-session') {
            setInfo("Your session is invalid. Please log in again.");
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            const res = await credentialsLogin({ email, password });

            if (res?.error) {
                setError("Invalid email or password");
                return;
            }

            router.push("/");
        } catch (err) {
            setError("Something went wrong");
            console.error(err);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            await socialLogin(provider);
        } catch (err) {
            console.error(err);
        }
    };

    return (<div className={styles.auth}>
        <h1 className={styles.title}>Welcome Back</h1>
        {info && <div className={styles.info}>{info}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button className={styles.button}>Login</button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
        <div className={styles.or}>OR</div>
        <div className={styles.social}>
            <button
                onClick={() => handleSocialLogin("google")}
                className={`${styles.socialButton} ${styles.google}`}
            >
                Sign in with Google
            </button>
            <button
                onClick={() => handleSocialLogin("github")}
                className={`${styles.socialButton} ${styles.github}`}
            >
                Sign in with GitHub
            </button>
        </div>
        <div className={styles.link}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.linkText}>
                Register
            </Link>
        </div>
    </div>
    );
};

export default LoginForm;
