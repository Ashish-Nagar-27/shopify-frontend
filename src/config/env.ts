export const env = {
    API_BASE_URL: import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5000/",
    IS_DEV: import.meta.env.DEV,
} as const;
