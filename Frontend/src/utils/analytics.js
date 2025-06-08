import { fetchWithAuth } from '@/utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Track a page view
export const trackPageView = async (page = window.location.pathname) => {
    try {
        const response = await fetch(`${API_URL}/analytics/pageview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer || null,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to track page view');
        }

        return await response.json();
    } catch (error) {
        console.error('Error tracking page view:', error);
        return null;
    }
};

// Get analytics data (admin only)
export const getAnalytics = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/analytics`);

        if (!response.ok) {
            throw new Error('Failed to fetch analytics');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }
};

// Get viewer count
export const getViewerCount = async () => {
    try {
        const response = await fetch(`${API_URL}/analytics/viewers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch viewer count');
        }

        const data = await response.json();
        return data.totalViews || 0;
    } catch (error) {
        console.error('Error fetching viewer count:', error);
        return 0;
    }
};

// Get page views by date range
export const getPageViewsByDateRange = async (startDate, endDate) => {
    try {
        const params = new URLSearchParams({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });

        const response = await fetchWithAuth(`${API_URL}/analytics/pageviews?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch page views');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching page views:', error);
        throw error;
    }
};
