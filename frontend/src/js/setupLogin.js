import axios from "axios";
import { redirecto } from "../router";
const API_URL = import.meta.env.VITE_API_URL

// Function to setup login event listener
export async function setupLogin() {




  const formregister=document.getElementById("aregister")
  console.log(formregister);

  if (formregister) {
     formregister.addEventListener("click",()=>{
    redirecto("/register")
    
    
  })
  console.log("NO ME SALE ");
  
    
  }
 
  
 
  const loginForm = document.getElementById("loginForm");
  // Add submit event listener to the login form
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get email and password values from the form
    const email = loginForm.email?.value?.trim();
    const password = loginForm.password?.value;
    if (!email || !password) {
      // Warn if email or password is empty
      console.warn("Email or password is empty");
      return;
    }
    try {
      // Send POST request to login endpoint
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      // Get user data from response
      const user =await res.data.users
      // Save user data to localStorage
      localStorage.setItem("current", JSON.stringify(user))
      // Redirect based on user role
      if (user.role===2) {
        redirecto("/dashboardDoctor")
        
      }else if(user.role===3){
        redirecto("/dashboard")
      }else{
        redirecto("/notfound")
      }

    } catch (err) {
      console.error("Error en login", err);
    }
  });
}
