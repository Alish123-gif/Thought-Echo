"use client";
import React from 'react';
import styles from './dataMessage.module.css';
import { FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Component to display informative messages about data states
 * 
 * @param {Object} props Component props
 * @param {string} props.type - 'info', 'warning', 'error', or 'success'
 * @param {string} props.title - Message title
 * @param {string} props.message - Message details
 * @param {React.ReactNode} props.action - Optional action element (button, link, etc.)
 * @param {boolean} props.showRetry - Show retry button for error states
 * @param {Function} props.onRetry - Retry callback function
 * @param {boolean} props.animated - Add animation to the component
 * @returns {JSX.Element} DataMessage component
 */
const DataMessage = ({ type = 'info', title, message, action, showRetry = false, onRetry, animated = true }) => {
    const getIcon = () => {
        switch (type) {
            case 'warning':
                return <FaExclamationTriangle className={styles.icon} />;
            case 'error':
                return <FaTimesCircle className={styles.icon} />;
            case 'success':
                return <FaCheckCircle className={styles.icon} />;
            case 'info':
            default:
                return <FaInfoCircle className={styles.icon} />;
        }
    };

    return (
        <div className={`${styles.container} ${styles[type]} ${animated ? styles.animated : ''}`}>
            <div className={styles.iconWrapper}>
                {getIcon()}
            </div>
            <div className={styles.content}>
                {title && <h3 className={styles.title}>{title}</h3>}
                {message && <p className={styles.message}>{message}</p>}
                {action && <div className={styles.actionWrapper}>{action}</div>}
                {showRetry && onRetry && type === 'error' && (
                    <div className={styles.actionWrapper}>
                        <button
                            onClick={onRetry}
                            className={styles.retryButton}
                        >
                            <span>Try Again</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataMessage;
