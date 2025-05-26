// API utility functions for interacting with the backend
import { signIn, signOut } from "next-auth/react";
import { fetchWithAuth, handleAuthError } from "./auth";

/**
 * Base URL for the API
 * In production this would come from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic error handler for API responses
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} - Parsed response data
 */
const handleApiResponse = async (response) => {
    // Handle authentication errors first
    const authErrorHandled = await handleAuthError(response);
    if (authErrorHandled) {
        throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
};

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Login response with user data and token
 */
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Register a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Registration response
 */
export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

/**
 * Sign in with social providers (Google, GitHub, etc.)
 * @param {string} provider - The social provider (google, github)
 * @returns {Promise<Object>} - Authentication response
 */
export const socialLogin = async (provider) => {
    try {
        return await signIn(provider);
    } catch (error) {
        console.error(`${provider} login error:`, error);
        throw error;
    }
};

/**
 * Sign in with credentials (email/password)
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - Authentication response
 */
export const credentialsLogin = async (credentials) => {
    try {
        return await signIn("credentials", {
            ...credentials,
            redirect: false,
        });
    } catch (error) {
        console.error('Credentials login error:', error);
        throw error;
    }
};

/**
 * Sign out the current user
 * @param {string} callbackUrl - URL to redirect to after logout
 * @returns {Promise<void>}
 */
export const logoutUser = async (callbackUrl = "/") => {
    try {
        await signOut({ redirect: true, callbackUrl });
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

// Blog API Functions

/**
 * Get all blog posts with optional filtering
 * @param {Object} options - Filter options
 * @param {number} options.page - Page number for pagination
 * @param {number} options.limit - Number of posts per page
 * @param {string} options.category - Filter by category
 * @param {string} options.tag - Filter by tag
 * @param {boolean} options.featured - Filter featured posts
 * @param {string} options.author - Filter by author ID
 * @param {boolean} options.published - Filter published status
 * @returns {Promise<Object>} - Posts data with pagination info
 */
export const getPosts = async (options = {}) => {
    try {
        const params = new URLSearchParams();

        // Add pagination and filter params
        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.category) params.append('category', options.category);
        if (options.tag) params.append('tag', options.tag);
        if (options.featured !== undefined) params.append('featured', options.featured);
        if (options.author) params.append('author', options.author);
        if (options.published !== undefined) params.append('published', options.published);

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await fetch(`${API_BASE_URL}/posts${queryString}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch posts');
        }

        return data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

/**
 * Get a single blog post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object>} - Post data
 */
export const getPostBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${slug}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch post');
        }

        return data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

/**
 * Get a single blog post by ID
 * @param {string} id - The post ID
 * @returns {Promise<Object>} - Post data
 */
export const getPostById = async (id) => {
    try {
        // Use the new backend route for fetching by UUID
        const response = await fetch(`${API_BASE_URL}/posts/id/${id}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch post');
        }
        return data;
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

/**
 * Get featured blog posts
 * @param {number} limit - Number of featured posts to fetch
 * @returns {Promise<Array>} - Array of featured posts
 */
export const getFeaturedPosts = async (limit = 5) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/featured?limit=${limit}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch featured posts');
        }

        return data;
    } catch (error) {
        console.error('Error fetching featured posts:', error);
        throw error;
    }
};

/**
 * Get posts by category
 * @param {string} category - Category name
 * @param {number} page - Page number
 * @param {number} limit - Posts per page
 * @returns {Promise<Object>} - Posts data with pagination info
 */
export const getPostsByCategory = async (category, page = 1, limit = 10) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/posts/category/${category}?page=${page}&limit=${limit}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch category posts');
        }

        return data;
    } catch (error) {
        console.error('Error fetching category posts:', error);
        throw error;
    }
};

/**
 * Create a new blog post
 * @param {FormData} formData - Form data with post details and image
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Created post data
 */
export const createPost = async (formData, token) => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/posts`, {
            method: 'POST',
            body: formData
        });

        return await handleApiResponse(response);
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

/**
 * Update an existing blog post
 * @param {string} id - Post ID
 * @param {FormData} formData - Form data with post details and image
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Updated post data
 */
export const updatePost = async (id, formData, token) => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
            method: 'PUT',
            body: formData
        });

        return await handleApiResponse(response);
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

/**
 * Delete a blog post
 * @param {string} id - Post ID
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Delete response
 */
export const deletePost = async (id, token) => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await handleApiResponse(response);
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

/**
 * Get current user's posts
 * @param {string} token - JWT token for authentication
 * @param {Object} options - Options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Posts per page
 * @param {boolean} options.published - Filter by published status
 * @returns {Promise<Object>} - User posts with pagination info
 */
export const getUserPosts = async (token, options = {}) => {
    try {
        const params = new URLSearchParams();

        if (options.page) params.append('page', options.page);
        if (options.limit) params.append('limit', options.limit);
        if (options.published !== undefined) params.append('published', options.published);

        const queryString = params.toString() ? `?${params.toString()}` : '';

        const response = await fetchWithAuth(`${API_BASE_URL}/posts/user/posts${queryString}`);

        return await handleApiResponse(response);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};
