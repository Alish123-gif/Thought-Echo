import React from 'react'
import styles from './authLinks.module.css'
import navbarStyles from '../navbar/navbar.module.css'
import Link from 'next/link';
const AuthLinks = () => {
    //temporary user variable
    const user = "nonAuthenticated";
    return (
        <>
            {user === "nonAuthenticated" ? (
                <Link className={navbarStyles.dropdownItem} href="/login">Login</Link>
            ) : (
                <>
                    <Link className={navbarStyles.dropdownItem} herf="/write">Write</Link>
                    <span className={navbarStyles.dropdownItem}>Logout</span>
                </>
            )}
        </>
    )
}

export default AuthLinks