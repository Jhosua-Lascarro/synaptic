import axios from "axios";
const API_URL = "http://localhost:3000/";
export async function registerPost(newUser) {
    try {
        const resp = await axios.post(`${API_URL}`,newUser); 
        return resp.data;
    } catch (error) {
        
        console.error("Error en el registro:", error.response?.data || error.message);
        throw error; 
    }








}