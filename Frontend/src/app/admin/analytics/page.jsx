'use client'

import React, { useState, useEffect } from 'react'
import styles from './analytics.module.css'
import { getViewerCount } from '@/utils/analytics'
import { HiEye, HiUsers, HiChartBar, HiRefresh } from 'react-icons/hi'

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        avgViewsPerDay: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const fetchAnalytics = async () => {
        try {
            setError(null)
            // Get viewer count (this will work even if backend isn't fully set up)
            const viewerCount = await getViewerCount()

            // Mock additional data for now (you can replace with real API calls later)
            setAnalytics({
                totalViews: viewerCount,
                uniqueVisitors: Math.floor(viewerCount * 0.7), // Estimate 70% unique
                avgViewsPerDay: Math.floor(viewerCount / 30) // Last 30 days estimate
            })
        } catch (err) {
            console.error('Error fetching analytics:', err)
            setError('Failed to load analytics data')
            // Set fallback data
            setAnalytics({
                totalViews: 0,
                uniqueVisitors: 0,
                avgViewsPerDay: 0
            })
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchAnalytics()
    }

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}></div>
                    Loading analytics...
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <HiChartBar />
                    Analytics Dashboard
                </h1>
                <p className={styles.subtitle}>
                    Track your website performance and visitor insights
                </p>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                    <button
                        className={styles.refreshButton}
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <HiRefresh /> {refreshing ? 'Refreshing...' : 'Try Again'}
                    </button>
                </div>
            )}

            <div className={styles.statsGrid}>
                {/* Total Views Card */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statTitle}>Total Views</h3>
                        <div className={styles.statIcon}>
                            <HiEye />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {formatNumber(analytics.totalViews)}
                    </div>
                    <p className={styles.statDescription}>
                        Total page views across your website
                    </p>
                </div>

                {/* Unique Visitors Card */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statTitle}>Unique Visitors</h3>
                        <div className={styles.statIcon}>
                            <HiUsers />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {formatNumber(analytics.uniqueVisitors)}
                    </div>
                    <p className={styles.statDescription}>
                        Estimated unique visitors this month
                    </p>
                </div>

                {/* Average Daily Views Card */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <h3 className={styles.statTitle}>Daily Average</h3>
                        <div className={styles.statIcon}>
                            <HiChartBar />
                        </div>
                    </div>
                    <div className={styles.statValue}>
                        {formatNumber(analytics.avgViewsPerDay)}
                    </div>
                    <p className={styles.statDescription}>
                        Average views per day (last 30 days)
                    </p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    className={styles.refreshButton}
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <HiRefresh /> {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
        </div>
    )
}

export default AnalyticsPage