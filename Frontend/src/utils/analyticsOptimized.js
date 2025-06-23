// Non-blocking analytics utility
let analyticsQueue = [];
let isProcessing = false;
let batchTimeout = null;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BATCH_SIZE = 10;
const BATCH_DELAY = 2000; // 2 seconds

// Optimized page view tracking with queueing
export const trackPageViewOptimized = (page = window.location.pathname) => {
    // Add to queue instead of making immediate request
    analyticsQueue.push({
        type: 'pageview',
        page,
        timestamp: Date.now(),
        sessionId: getOrCreateSessionId(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    });

    // Process queue in batches
    if (!isProcessing) {
        scheduleProcessing();
    }
};

// Get or create session ID
const getOrCreateSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
};

// Schedule batch processing
const scheduleProcessing = () => {
    if (batchTimeout) {
        clearTimeout(batchTimeout);
    }

    batchTimeout = setTimeout(() => {
        processBatch();
    }, BATCH_DELAY);
};

// Process analytics queue in batches
const processBatch = async () => {
    if (analyticsQueue.length === 0 || isProcessing) {
        return;
    }

    isProcessing = true;
    const batch = analyticsQueue.splice(0, BATCH_SIZE);

    try {
        // Use sendBeacon for better performance if available
        if (navigator.sendBeacon) {
            const data = JSON.stringify({ events: batch });
            navigator.sendBeacon(`${API_URL}/analytics/batch`, data);
        } else {
            // Fallback to fetch with no-await pattern
            fetch(`${API_URL}/analytics/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events: batch }),
                keepalive: true // Keep request alive even if page unloads
            }).catch(error => {
                console.warn('Analytics batch failed:', error);
                // Re-queue failed events (with limit to prevent infinite loops)
                if (batch.length < 50) {
                    analyticsQueue.unshift(...batch);
                }
            });
        }
    } catch (error) {
        console.warn('Analytics processing failed:', error);
    } finally {
        isProcessing = false;

        // Process remaining items if any
        if (analyticsQueue.length > 0) {
            scheduleProcessing();
        }
    }
};

// Flush queue on page unload
const flushAnalytics = () => {
    if (analyticsQueue.length > 0) {
        const data = JSON.stringify({ events: analyticsQueue });
        if (navigator.sendBeacon) {
            navigator.sendBeacon(`${API_URL}/analytics/batch`, data);
        }
        analyticsQueue = [];
    }
};

// Set up event listeners for page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flushAnalytics);
    window.addEventListener('pagehide', flushAnalytics);

    // Also flush on visibility change (mobile browsers)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushAnalytics();
        }
    });
}

// Export the main function
export const trackPageView = trackPageViewOptimized;
