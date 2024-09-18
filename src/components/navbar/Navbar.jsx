import React from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { AuthLinks, ThemeToggle } from '..';
import DropDown from './DropDown';
const Navbar = () => {


    return (
        <div className={styles.container}>
            <div className={styles.social}>
                <a href="www.facebook.com"><Image src="/x.png" alt="x" width={24} height={24} /></a>
                <a herf="instagram.com"><Image src="/instagram.png" alt="instagram" width={24} height={24} /></a>
                <a herf="linkedin.com"><Image src="/linkedin.png" alt="linkedin" width={24} height={24} /></a>
                <a herf="tiktok.com"><Image src="/tiktok.png" alt="tiktok" width={24} height={24} /></a>
            </div>
            <DropDown>
                <div className={styles.logo}>ThoughtEcho</div>
            </DropDown>
            <div className={styles.links}>
                <ThemeToggle />
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <AuthLinks />
            </div>

        </div>
    );
};

export default Navbar;