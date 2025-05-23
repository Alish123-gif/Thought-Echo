"use client";
import React, { useEffect, useState } from 'react';
import styles from './menuCategories.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/utils/categoryService';

const MenuCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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

        fetchCategories();
    }, []);

    if (loading) {
        return <div className={styles.loadingCategories}>Loading categories...</div>;
    }

    return (
        <div className={styles.categoryList}>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/blog?cat=${category.slug}`}
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