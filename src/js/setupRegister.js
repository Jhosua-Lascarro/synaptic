import { registerPost } from "@/auth/registerApi";
import { redirecto } from "../router";
import axios from "axios";

const API_PATIENTS = "https://synaptic-fao4.onrender.com/patiens";

// Function to setup register event listener
export async function setupRegister() {
  // Add a small delay to ensure DOM is fully rendered
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const form = document.getElementById("registerForm");

  // Check if form exists before adding event listener
  if (!form) {
    console.error("Register form not found");
    return;
  }

  // Add submit event listener to the register form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = Number.parseInt(document.getElementById("role").value);

      if (!name || !email || !password || !role) {
        alert("Please fill in all fields.");
        return;
      }

      const newuser = {
        fullname: name,
        emailInput: email,
        password_hash: password,
        role: role,
      };

      // Register user
      const resp = await registerPost(newuser);
      
      // validation for change from role of user to patients
      //(CREATE PACIENT)
      const user = resp.data.user;

      if (user && user.role === 3) {
        await axios.post(API_PATIENTS, { user_id: user.id });
      }

      alert("Successful registration, please log in.");
      redirecto("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        error.response?.data?.message || error.message || "Error in the registration"
      );
    }
  });
}
