import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL


export async function registerPost(newUser) {
    try {
        const resp = await axios.post(`${API_URL}/users`,newUser); 
        return resp
    } catch (error) {
        
        console.error("Error en el registro:", error.response?.data || error.message);
        throw error; 
    }








}