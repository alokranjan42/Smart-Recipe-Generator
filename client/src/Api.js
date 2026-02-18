 import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8002/api",
    withCredentials: true, // ⭐⭐⭐ THIS WAS MISSING
});

// attach token from localStorage (backup auth)
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
