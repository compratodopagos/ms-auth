export const getDefaultHeaders = (origin?: string) => ({
    "Vary": "Origin",
    "Access-Control-Allow-Origin": origin || process.env.public_path || "https://localhost:5173",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
});