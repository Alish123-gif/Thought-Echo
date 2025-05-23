"use client";
import { useState } from 'react';
import styles from './auth.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerUser, socialLogin } from '@/utils/api';

const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            // Use the API utility function for registration
            await registerUser(name, email, password);

            // Registration successful, redirect to login
            alert("Registration successful! Please log in.");
            router.push("/login");

        } catch (err) {
            setError(err.message || "Something went wrong during registration");
            console.error(err);
        }
    }; const handleSocialLogin = async (provider) => {
        try {
            await socialLogin(provider);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.auth}>
            <h1 className={styles.title}>Join Thought Echo</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Name"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button className={styles.button}>Register</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            <div className={styles.or}>OR</div>
            <div className={styles.social}>
                <button
                    onClick={() => handleSocialLogin("google")}
                    className={`${styles.socialButton} ${styles.google}`}
                >
                    Sign up with Google
                </button>
                <button
                    onClick={() => handleSocialLogin("github")}
                    className={`${styles.socialButton} ${styles.github}`}
                >
                    Sign up with GitHub
                </button>
            </div>
            <div className={styles.link}>
                Already have an account?{" "}
                <Link href="/login" className={styles.linkText}>
                    Login
                </Link>
            </div>
        </div>
    );
};

export default RegisterForm;
