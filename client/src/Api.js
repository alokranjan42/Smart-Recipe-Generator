 import axios from "axios";

const API = axios.create({
    baseURL: "https://smart-recipe-generator-1-6rv2.onrender.com/api",
    withCredentials: true, 
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
