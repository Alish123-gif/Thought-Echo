"use client";
import React, { useEffect, useState } from 'react';
import styles from './menuCategories.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/utils/categoryService';

const MenuCategories = ({ initialData = null }) => {
    const [categories, setCategories] = useState(initialData || []);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data if we don't have initial data
        if (!initialData) {
            fetchCategories();
        }
    }, [initialData]);

    if (loading) {
        return <div className={styles.loadingCategories}>Loading categories...</div>;
    }

    return (
        <div className={styles.categoryList}>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/posts?category=${category.id}`}
                    className={styles.categoryItem}
                    style={{ backgroundColor: category.color }}
                >
                    {category.imageUrl && (
                        <Image
                            src={category.imageUrl}
                            alt={category.name}
                            width={20}
                            height={20}
                            className={styles.categoryImage}
                            unoptimized
                        />
                    )}
                    {category.name}
                </Link>
            ))}
        </div>
    );
};

export default MenuCategories