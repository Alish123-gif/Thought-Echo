"use client";
import React from 'react';
import styles from './loadingSpinner.module.css';

/**
 * Loading spinner component
 * @param {Object} props Component props
 * @param {string} props.size - 'small', 'medium', or 'large'
 * @param {string} props.color - CSS color value
 * @returns {JSX.Element} LoadingSpinner component
 */
const LoadingSpinner = ({ size = 'medium', color = '#2563eb' }) => {
    const sizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

    return (
        <div className={styles.spinnerContainer}>
            <div
                className={`${styles.spinner} ${sizeClass}`}
                style={{ borderTopColor: color }}
            ></div>
            <span className={styles.visuallyHidden}>Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
