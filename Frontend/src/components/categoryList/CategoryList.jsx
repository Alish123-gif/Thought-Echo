"use client";
import React, { useEffect, useState } from 'react';
import styles from './categoryList.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/utils/categoryService';
import LoadingSpinner from '../ui/LoadingSpinner';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Categories</h1>
                <div className={styles.loadingContainer}>
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Categories</h1>
                <div className={styles.errorMessage}>{error}</div>
            </div>
        );
    } return (
        <div className={styles.container}>
            <h1 className={styles.title}>Categories</h1>
            <div className={styles.categories}>
                {categories.map((category) => (
                    <Link
                        href={`/blog?cat=${category.slug}`}
                        key={category.id}
                        className={`${styles.category}`}
                        style={{ backgroundColor: category.color }}
                    >
                        {category.imageUrl ? (
                            <Image
                                className={styles.image}
                                src={category.imageUrl}
                                alt={category.name}
                                width={32}
                                height={32}
                                unoptimized
                            />
                        ) : (
                            <div className={styles.noImage} />
                        )}
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList