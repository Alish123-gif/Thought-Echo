"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RecentPosts, Featured, Menu } from "@/components";
import styles from "./homepage.module.css";

// Deferred analytics tracking
const trackPageViewDeferred = async () => {
    try {
        // Use dynamic import to defer analytics loading
        const { trackPageView } = await import("@/utils/analyticsOptimized");
        // Delay tracking until after critical content is rendered
        setTimeout(() => {
            trackPageView("/");
        }, 1000);
    } catch (error) {
        console.warn("Analytics tracking failed:", error);
    }
};

export default function HomePageClient({ initialData, dataError, searchParams }) {
    const [error, setError] = useState(null);

    useEffect(() => {
        const errorParam = searchParams?.error;
        if (errorParam === "adminAccess") {
            setError("You don't have permission to access the admin area.");
            // Clear the error parameter after 5 seconds
            const timer = setTimeout(() => {
                setError(null);
                // Remove the error from URL without page refresh
                if (window.history.replaceState) {
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    // Defer analytics tracking
    useEffect(() => {
        trackPageViewDeferred();
    }, []);

    return (
        <>
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                    <button onClick={() => setError(null)} className={styles.closeError}>×</button>
                </div>
            )}

            {dataError && (
                <div className={styles.errorMessage}>
                    Failed to load page data: {dataError}
                </div>
            )}

            {initialData ? (
                <>
                    <Featured initialData={initialData.featured} />
                    <div className={styles.content}>
                        <RecentPosts initialData={initialData.recent} />
                        <Menu initialData={initialData.menu} />
                    </div>
                </>
            ) : (
                // Fallback to client-side loading if server-side data fails
                <>
                    <Featured />
                    <div className={styles.content}>
                        <RecentPosts />
                        <Menu />
                    </div>
                </>
            )}
        </>
    );
}
