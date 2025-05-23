"use client";
import React, { useState, useEffect } from 'react';
import styles from './settings_components.module.css';
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiSearch } from 'react-icons/hi';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/utils/categoryService';

const CategoriesSettings = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        color: '#3B82F6',
        description: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch categories on initial load
    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch categories. Please try again.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchCategoriesData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name' && !editingCategoryId) {
            // Auto-generate slug from name for new categories
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData({ ...formData, name: value, slug });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            color: '#3B82F6',
            description: ''
        });
        setEditingCategoryId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Validation
            if (!formData.name.trim()) {
                setError('Category name is required');
                setLoading(false);
                return;
            }

            let result;

            if (editingCategoryId) {
                // Update existing category
                result = await updateCategory(editingCategoryId, formData);

                // Update in local state
                setCategories(categories.map(cat =>
                    cat.id === editingCategoryId ? { ...cat, ...result } : cat
                ));
            } else {
                // Create new category
                result = await createCategory(formData);

                // Add to local state
                setCategories([...categories, result]);
            }

            setLoading(false);
            resetForm();
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to save category. Please try again.');
            setLoading(false);
            console.error(err);
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            slug: category.slug,
            color: category.color,
            description: category.description || ''
        });
        setEditingCategoryId(category.id);
        setShowForm(true);
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            setLoading(true);

            await deleteCategory(categoryId);

            // Remove from local state
            setCategories(categories.filter(cat => cat.id !== categoryId));
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to delete category. Please try again.');
            setLoading(false);
            console.error(err);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.categorySection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Category Management</h2>
                {!showForm && (
                    <button
                        className={styles.addButton}
                        onClick={() => setShowForm(true)}
                    >
                        <HiPlus /> Add Category
                    </button>
                )}
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                    <button
                        className={styles.closeError}
                        onClick={() => setError(null)}
                    >
                        <HiX />
                    </button>
                </div>
            )}

            {showForm && (
                <form className={styles.categoryForm} onSubmit={handleSubmit}>
                    <h3>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h3>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Category Name*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Technology"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="slug">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="e.g., technology"
                        />
                        <small>Used in URLs, auto-generated from name if left empty</small>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="color">Color</label>
                        <div className={styles.colorPickerWrapper}>
                            <input
                                type="color"
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                placeholder="#RRGGBB"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Brief description of this category"
                            rows="3"
                        />
                    </div>

                    <div className={styles.formPreview}>
                        <span>Preview: </span>
                        <span
                            className={styles.categoryBadge}
                            style={{ backgroundColor: formData.color }}
                        >
                            {formData.name || 'Category Name'}
                        </span>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner size="small" color="white" /> : (
                                <>
                                    <HiCheck /> {editingCategoryId ? 'Update' : 'Save'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.searchBox}>
                <HiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading && !showForm ? (
                <div className={styles.loadingContainer}>
                    <LoadingSpinner />
                </div>
            ) : (
                <div className={styles.categoryTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableCell}>Name</div>
                        <div className={styles.tableCell}>Slug</div>
                        <div className={styles.tableCell}>Color</div>
                        <div className={styles.tableCell}>Posts</div>
                        <div className={styles.tableCell}>Actions</div>
                    </div>

                    {filteredCategories.length > 0 ? (filteredCategories.map(category => (
                        <div key={category.id} className={styles.tableRow}>
                            <div className={styles.tableCell}>
                                <span
                                    className={styles.categoryBadge}
                                    style={{ backgroundColor: category.color }}
                                >
                                    {category.name}
                                </span>
                            </div>
                            <div className={styles.tableCell}>{category.slug}</div>
                            <div className={styles.tableCell}>
                                <div className={styles.colorPreview} style={{ backgroundColor: category.color }}></div>
                                {category.color}
                            </div>
                            <div className={styles.tableCell}>{category.postCount || 0}</div>
                            <div className={styles.tableCell}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEdit(category)}
                                >
                                    <HiPencil />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(category.id)}
                                >
                                    <HiTrash />
                                </button>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className={styles.emptyState}>
                            {searchQuery ? 'No categories match your search' : 'No categories found. Create your first one!'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriesSettings;
