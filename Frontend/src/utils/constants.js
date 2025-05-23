// Constants for the blog application

/**
 * Blog post categories with their display labels and values
 */
export const CATEGORIES = [
    { value: 'style', label: 'Style & Fashion' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel & Adventure' },
    { value: 'culture', label: 'Culture & Arts' },
    { value: 'coding', label: 'Coding & Technology' },
    { value: 'science', label: 'Science & Education' },
    { value: 'health', label: 'Health & Wellness' },
];

/**
 * Default pagination limits for different views
 */
export const PAGINATION_LIMITS = {
    SMALL: 6,
    MEDIUM: 12,
    LARGE: 24
};

/**
 * Sort options for posts listing
 */
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' }
];

/**
 * View mode options
 */
export const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list'
};

/**
 * Error retry count - max number of automatic retries on error
 */
export const MAX_ERROR_RETRIES = 3;

/**
 * Default debounce delay for search in milliseconds
 */
export const SEARCH_DEBOUNCE_DELAY = 300;
