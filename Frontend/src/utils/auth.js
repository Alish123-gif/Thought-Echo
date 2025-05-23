import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getSession } from "next-auth/react";

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

    // Return the fetch promise
    return fetch(url, {
        ...options,
        headers,
    });
};
