import { registerPost } from "@/auth/registerApi";

// Function to setup register event listener
export async function setupRegister() {
  const form = document.getElementById("form");

  // Add submit event listener to the register form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      // Get values from the form fields
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

      // Check if passwords match
      if (password !== confirm) {
        return alert("No coinciden las contraseñas");
      }
      // Create new user object
      const newuser = {
        fullname: fullname,
        emailInput: email,
        identification: identification,
        phone: phone,
        birthdate: birthdate,
        sexo: gender,
        password_hash: password,
        role: 3,
      };

      // Send registration data to API
      const data = await registerPost(newuser);
      // if registration is successful, redirect to login
      if (data) {
        alert("Registro exitoso, por favor inicia sesión.");
        window.location.href = "/";
      }
    } catch (error) {
      // Handle registration error
      alert(
        error.response?.data?.message || error.message || "Error en el registro"
      );
    }
  });
}
