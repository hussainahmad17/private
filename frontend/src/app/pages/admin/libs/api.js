// frontend/src/lib/api.js (example)
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:3000" // your local backend
    : "https://private-blue-kappa.vercel.app" // deployed backend
});
export default api;


 
