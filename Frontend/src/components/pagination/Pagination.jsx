import React from 'react'
import styles from './pagination.module.css'

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    totalPosts = 0,
    onPageChange
}) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        handlePageChange(currentPage - 1);
    };

    const handleNext = () => {
        handlePageChange(currentPage + 1);
    };

    // Don't render pagination if there's only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.container}>
            <button
                className={`${styles.button} ${currentPage === 1 ? styles.disabled : ''}`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <div className={styles.pageInfo}>
                <span>Page {currentPage} of {totalPages}</span>
                {totalPosts > 0 && (
                    <span className={styles.totalPosts}>
                        ({totalPosts} total posts)
                    </span>
                )}
            </div>

            <button
                className={`${styles.button} ${currentPage === totalPages ? styles.disabled : ''}`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination