const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://customenglish.up.railway.app"
        : "http://127.0.0.1:8000";

export default API_BASE_URL;
