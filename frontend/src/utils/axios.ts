
import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL + "/api";
const API_URL = "__VITE_API_URL__" + "/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});
