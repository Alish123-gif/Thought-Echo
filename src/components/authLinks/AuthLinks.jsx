import React from 'react'
import styles from './authLinks.module.css'
import Link from 'next/link';
const AuthLinks = () => {
    //temporary user variable
    const user = "nonAuthenticated";
    return (
        <>
            {user === "nonAuthenticated" ? (
                <Link href="/login">Login</Link>
            ) : (
                <>
                    <Link herf="/write">Write</Link>
                    <span className={styles.link}>Logout</span>
                </>
            )}
        </>
    )
}

export default AuthLinks