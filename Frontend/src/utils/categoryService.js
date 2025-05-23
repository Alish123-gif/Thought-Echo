import { fetchWithAuth } from '@/utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all categories
 * @returns {Promise<Array>} List of categories
 */
export const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch categories');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create category');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating category:', error);
        // Check if it's an auth error and provide more helpful message
        if (error.message.includes('401') || error.message.includes('auth')) {
            throw new Error('Authentication failed. Please log in again.');
        }
        throw error;
    }
};

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update category');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating category:', error);
        // Check if it's an auth error and provide more helpful message
        if (error.message.includes('401') || error.message.includes('auth')) {
            throw new Error('Authentication failed. Please log in again.');
        }
        throw error;
    }
};

/**
 * Delete a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Success message
 */
export const deleteCategory = async (id) => {
    try {
        const response = await fetchWithAuth(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete category');
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting category:', error);
        // Check if it's an auth error and provide more helpful message
        if (error.message.includes('401') || error.message.includes('auth')) {
            throw new Error('Authentication failed. Please log in again.');
        }
        throw error;
    }
};
