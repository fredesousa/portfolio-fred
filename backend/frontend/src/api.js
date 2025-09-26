import axios from "axios";

// Si proxy dans package.json : baseURL = "/api"
// Sinon, utilise REACT_APP_API_BASE_URL
const base = process.env.REACT_APP_API_BASE_URL || "";
export const api = axios.create({ baseURL: base ? `${base}/api` : "/api" });
