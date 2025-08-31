import { registerPost } from "@/auth/registerApi";
import axios from "axios";

const API_PATIENTS = "http://localhost:3000/patiens";

// Function to setup register event listener
export async function setupRegister() {
  const form = document.getElementById("form");

  // Add submit event listener to the register form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      // -----------------------------
      // ORIGINAL LOGIC
      // -----------------------------
      const fullname = document.getElementById("fullname").value;
      const email = document.getElementById("email").value;
      const identification = document.getElementById("identification").value;
      const phone = document.getElementById("phone").value;
      const birthdate = document.getElementById("birthdate").value;
      const gender = document.querySelector(
        'input[name="gender"]:checked'
      )?.value;
      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm-password").value;

      if (password !== confirm) {
        return alert("No coinciden las contraseñas");
      }

      const newuser = {
        fullname,
        emailInput: email,
        identification,
        phone,
        birthdate,
        sexo: gender,
        password_hash: password,
        role: 3,
      };

      // Register user
      const resp = await registerPost(newuser);

      // -----------------------------
      // NEW LOGIC (CREATE PACIENT)

      //const user = resp.data.user;

      //if (user && user.role === 3) {
      //  await axios.post(API_PATIENTS, { user_id: user.id });
      //}
      // -----------------------------

      alert("Registro exitoso, por favor inicia sesión.");
      window.location.href = "/";
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Error en el registro"
      );
    }
  });
}
