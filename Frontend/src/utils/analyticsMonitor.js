// Analytics Performance Monitor
// This utility helps monitor and debug analytics performance

class AnalyticsMonitor {
    constructor() {
        this.metrics = {
            requestCount: 0,
            successCount: 0,
            errorCount: 0,
            duplicateCount: 0,
            rateLimitCount: 0,
            averageResponseTime: 0,
            responseTimes: [],
            cacheHits: 0,
            cacheMisses: 0
        };

        this.isMonitoring = process.env.NODE_ENV === 'development';
    }

    // Record a request attempt
    recordRequest() {
        if (!this.isMonitoring) return;
        this.metrics.requestCount++;
    }

    // Record a successful request
    recordSuccess(responseTime) {
        if (!this.isMonitoring) return;
        this.metrics.successCount++;
        this.recordResponseTime(responseTime);
    }

    // Record an error
    recordError(error) {
        if (!this.isMonitoring) return;
        this.metrics.errorCount++;
        console.warn('Analytics error recorded:', error.message);
    }

    // Record a duplicate detection
    recordDuplicate() {
        if (!this.isMonitoring) return;
        this.metrics.duplicateCount++;
    }

    // Record a rate limit hit
    recordRateLimit() {
        if (!this.isMonitoring) return;
        this.metrics.rateLimitCount++;
    }

    // Record response time
    recordResponseTime(time) {
        if (!this.isMonitoring) return;
        this.metrics.responseTimes.push(time);

        // Keep only last 100 response times
        if (this.metrics.responseTimes.length > 100) {
            this.metrics.responseTimes.shift();
        }

        // Calculate average
        this.metrics.averageResponseTime =
            this.metrics.responseTimes.reduce((a, b) => a + b, 0) /
            this.metrics.responseTimes.length;
    }

    // Record cache hit
    recordCacheHit() {
        if (!this.isMonitoring) return;
        this.metrics.cacheHits++;
    }

    // Record cache miss
    recordCacheMiss() {
        if (!this.isMonitoring) return;
        this.metrics.cacheMisses++;
    }

    // Get current metrics
    getMetrics() {
        const cacheTotal = this.metrics.cacheHits + this.metrics.cacheMisses;
        const cacheHitRate = cacheTotal > 0 ? (this.metrics.cacheHits / cacheTotal * 100).toFixed(2) : 0;
        const successRate = this.metrics.requestCount > 0 ?
            (this.metrics.successCount / this.metrics.requestCount * 100).toFixed(2) : 0;

        return {
            ...this.metrics,
            cacheHitRate: `${cacheHitRate}%`,
            successRate: `${successRate}%`,
            duplicateRate: this.metrics.requestCount > 0 ?
                `${(this.metrics.duplicateCount / this.metrics.requestCount * 100).toFixed(2)}%` : '0%'
        };
    }

    // Print metrics to console
    printMetrics() {
        if (!this.isMonitoring) return;

        console.group('📊 Analytics Performance Metrics');
        console.table(this.getMetrics());
        console.groupEnd();
    }

    // Reset metrics
    reset() {
        this.metrics = {
            requestCount: 0,
            successCount: 0,
            errorCount: 0,
            duplicateCount: 0,
            rateLimitCount: 0,
            averageResponseTime: 0,
            responseTimes: [],
            cacheHits: 0,
            cacheMisses: 0
        };
    }

    // Enable/disable monitoring
    setMonitoring(enabled) {
        this.isMonitoring = enabled;
    }
}

// Create singleton instance
const analyticsMonitor = new AnalyticsMonitor();

// Auto-print metrics every 5 minutes in development
if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
        analyticsMonitor.printMetrics();
    }, 5 * 60 * 1000);
}

export default analyticsMonitor;
