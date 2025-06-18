import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getSession, signOut } from "next-auth/react";

export const getAuthSession = async () => {
    const session = await getServerSession(options);
    return session;
};

export const getCurrentUser = async () => {
    try {
        const session = await getAuthSession();
        return session?.user;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
};

/**
 * Validates if the current token is still valid by making a request to the backend
 * @returns {Promise<boolean>} - Returns true if token is valid, false otherwise
 */
export const validateToken = async () => {
    try {
        const session = await getSession();

        if (!session?.accessToken) {
            return false;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/auth/validate-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            }
        });

        if (response.status === 401) {
            // Token is expired or invalid
            return false;
        }

        return response.ok;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

/**
 * Checks token validity and logs out user if token is expired
 * @returns {Promise<boolean>} - Returns true if token is valid, false if user was logged out
 */
export const checkTokenAndLogout = async () => {
    try {
        const session = await getSession();

        if (!session?.accessToken) {
            return true; // No token to validate
        }

        const isValid = await validateToken();

        if (!isValid) {
            console.warn('Token validation failed. Logging out user.');
            await signOut({
                redirect: true,
                callbackUrl: '/login?message=session-expired'
            });
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking token:', error);
        return true; // Don't logout on validation errors
    }
};

/**
 * Handle authentication errors globally
 * @param {Response} response - Fetch response
 * @returns {Promise<boolean>} - Returns true if error was handled, false otherwise
 */
export const handleAuthError = async (response) => {
    if (response.status === 401) {
        try {
            const data = await response.clone().json();

            // Check if it's a token expiration error
            if (data.tokenExpired || data.error === 'TokenExpiredError') {
                console.warn('Token expired. Signing out user.');
                await signOut({
                    redirect: true,
                    callbackUrl: '/login?message=session-expired'
                });
                return true;
            }

            // Check if it's an invalid token error
            if (data.tokenInvalid || data.error === 'JsonWebTokenError') {
                console.warn('Invalid token. Signing out user.');
                await signOut({
                    redirect: true,
                    callbackUrl: '/login?message=invalid-session'
                });
                return true;
            }
        } catch (parseError) {
            console.error('Error parsing auth error response:', parseError);
        }
    }
    return false;
};

/**
 * Makes an authenticated fetch request with the user's token
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const fetchWithAuth = async (url, options = {}) => {
    // Get the session from the client side
    const session = await getSession();

    // Set up headers with authorization if we have a token
    const headers = {
        ...options.headers,
    };

    if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
    } else {
        console.warn('No access token available for authenticated request');
    }

    // Make the fetch request
    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Handle authentication errors
    await handleAuthError(response);

    return response;
};
