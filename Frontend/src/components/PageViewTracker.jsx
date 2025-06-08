"use client";
import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/utils/analytics';

export default function PageViewTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef(null);
    const trackingTimeout = useRef(null);
    const isTracking = useRef(false);

    // Memoized function to check if page should be tracked
    const shouldTrackPage = useCallback((path) => {
        return !path.includes('api') && !path.includes('admin');
    }, []);

    // Memoized tracking function
    const handlePageTracking = useCallback(async (path) => {
        if (isTracking.current) return;
        isTracking.current = true;

        try {
            console.log(`📊 Tracking page view: ${path}`);
            const result = await trackPageView(path);

            if (result && !result.throttled) {
                lastTrackedPath.current = path;
                console.log(`✅ Page view tracked successfully`);
            } else if (result && result.throttled) {
                console.log(`⏱️ Page view throttled (already tracked recently)`);
                lastTrackedPath.current = path; // Still mark as tracked
            }
        } catch (error) {
            // Silently fail - don't break the user experience
            console.error('Failed to track page view:', error);
        } finally {
            isTracking.current = false;
        }
    }, []);

    useEffect(() => {
        // Only track if pathname has actually changed
        if (lastTrackedPath.current === pathname) {
            return;
        }

        if (!shouldTrackPage(pathname)) {
            return;
        }

        // Clear any pending tracking
        if (trackingTimeout.current) {
            clearTimeout(trackingTimeout.current);
        }

        // Track page view with debouncing to prevent rapid navigation issues
        trackingTimeout.current = setTimeout(() => {
            handlePageTracking(pathname);
        }, 500); // 500ms debounce

        return () => {
            if (trackingTimeout.current) {
                clearTimeout(trackingTimeout.current);
            }
        };
    }, [pathname, shouldTrackPage, handlePageTracking]);

    // This component doesn't render anything
    return null;
}
