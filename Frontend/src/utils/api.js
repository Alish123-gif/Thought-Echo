// API utility functions for interacting with the backend
import { signIn, signOut } from "next-auth/react";

/**
 * Base URL for the API
 * In production this would come from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
