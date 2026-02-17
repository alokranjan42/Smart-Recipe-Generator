import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8002/api",
  withCredentials: true,
});

export default API;
