import axios from "axios";
import { redirecto } from "../router";

// Function to setup login event listener
export async function setupLogin() {
  // Add a small delay to ensure DOM is fully rendered
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const loginForm = document.getElementById("loginForm");
  
  // Check if loginForm exists before adding event listener
  if (!loginForm) {
    console.error("Login form not found");
    return;
  }
  
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
      const res = await axios.post("https://synaptic-fao4.onrender.com/login", {
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
        redirecto("/404")
      }

    } catch (err) {
      console.error("Error en login", err);
    }
  });
}
