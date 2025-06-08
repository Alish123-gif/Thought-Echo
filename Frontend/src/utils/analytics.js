import { fetchWithAuth } from '@/utils/auth';
import analyticsMonitor from './analyticsMonitor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Performance optimizations
const pendingRequests = new Map();
const BATCH_DELAY = 1000; // 1 second delay for batching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const MAX_PENDING_REQUESTS = 100; // Prevent memory buildup
let viewerCountCache = null;
let cacheTimestamp = null;

// Cleanup pending requests periodically to prevent memory leaks
const cleanupPendingRequests = () => {
    if (pendingRequests.size > MAX_PENDING_REQUESTS) {
        // Remove oldest requests if we exceed limit
        const entries = Array.from(pendingRequests.entries());
        entries.slice(0, Math.floor(MAX_PENDING_REQUESTS / 2)).forEach(([key]) => {
            pendingRequests.delete(key);
        });
    }
};

// Auto cleanup every 5 minutes
setInterval(cleanupPendingRequests, 5 * 60 * 1000);

// Error recovery and retry logic
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

const retryRequest = async (requestFn, retries = 0) => {
    try {
        return await requestFn();
    } catch (error) {
        if (retries < MAX_RETRIES && !error.message.includes('rate limit')) {
            console.warn(`Analytics request failed, retrying... (${retries + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retries + 1)));
            return retryRequest(requestFn, retries + 1);
        }
        throw error;
    }
};
export const trackPageView = async (page = window.location.pathname) => {
    const startTime = Date.now();
    analyticsMonitor.recordRequest();

    try {
        // Generate or get session ID for user tracking
        let sessionId = sessionStorage.getItem('analytics_session');
        if (!sessionId) {
            sessionId = generateSessionId();
            sessionStorage.setItem('analytics_session', sessionId);
        }

        // Create a unique key for this page view
        const viewKey = `${sessionId}_${page}`;

        // Check if we already have a pending request for this exact view
        if (pendingRequests.has(viewKey)) {
            return pendingRequests.get(viewKey);
        }        // Create the tracking request with retry logic and debouncing
        const trackingPromise = new Promise((resolve) => {
            setTimeout(async () => {
                const requestFn = async () => {
                    // Use AbortController for request timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
                            sessionId,
                        }),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    return response.json();
                }; try {
                    const data = await retryRequest(requestFn);
                    const responseTime = Date.now() - startTime;

                    // Remove from pending requests
                    pendingRequests.delete(viewKey);

                    // Record metrics
                    analyticsMonitor.recordSuccess(responseTime);

                    // Handle different response types
                    if (data.rateLimited) {
                        analyticsMonitor.recordRateLimit();
                        console.warn('🚦 Analytics rate limited');
                    } else if (data.duplicate || data.throttled) {
                        analyticsMonitor.recordDuplicate();
                        console.log('🔄 Duplicate page view prevented:', data.message);
                    } else {
                        // Invalidate viewer count cache when new view is tracked
                        viewerCountCache = null;
                        cacheTimestamp = null;
                        console.log('📊 New unique page view tracked');
                    }

                    resolve(data);
                } catch (error) {
                    analyticsMonitor.recordError(error);
                    if (error.name === 'AbortError') {
                        console.warn('Analytics request timed out');
                    } else {
                        console.error('Error tracking page view:', error);
                    }
                    pendingRequests.delete(viewKey);
                    resolve(null);
                }
            }, BATCH_DELAY);
        });

        // Store the promise to prevent duplicate requests
        pendingRequests.set(viewKey, trackingPromise);

        return trackingPromise;
    } catch (error) {
        console.error('Error in trackPageView:', error);
        return null;
    }
};

// Generate a privacy-friendly session ID
const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const browserFingerprint = btoa(
        navigator.userAgent.slice(0, 50) +
        navigator.language +
        screen.width +
        screen.height
    ).slice(0, 10);

    return `session_${timestamp}_${random}_${browserFingerprint}`;
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

// Get viewer count with caching
export const getViewerCount = async () => {
    try {        // Check cache first
        const now = Date.now();
        if (viewerCountCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            analyticsMonitor.recordCacheHit();
            return viewerCountCache;
        }

        analyticsMonitor.recordCacheMiss();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${API_URL}/analytics/viewers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Failed to fetch viewer count');
        }

        const data = await response.json();
        const viewerCount = data.totalViews || 0;

        // Update cache
        viewerCountCache = viewerCount;
        cacheTimestamp = now;

        return viewerCount;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('Viewer count request timed out');
        } else {
            console.error('Error fetching viewer count:', error);
        }
        // Return cached value if available, otherwise 0
        return viewerCountCache || 0;
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

// Get session statistics (admin only)
export const getSessionStats = async () => {
    try {
        const response = await fetchWithAuth(`${API_URL}/analytics/sessions`);

        if (!response.ok) {
            throw new Error('Failed to fetch session stats');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching session stats:', error);
        throw error;
    }
};

// Clear analytics cache (useful for testing)
export const clearAnalyticsCache = () => {
    viewerCountCache = null;
    cacheTimestamp = null;
    pendingRequests.clear();
};

// Get cache status (useful for debugging)
export const getCacheStatus = () => {
    return {
        hasCache: !!viewerCountCache,
        cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
        pendingRequests: pendingRequests.size
    };
};

// Export analytics monitor for debugging
export { analyticsMonitor };
