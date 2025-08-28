import axios from "axios";

export async function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.email?.value?.trim();
    const password = loginForm.password?.value;
    if (!email || !password) {
      console.warn("Email o password vacíos");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      console.log("Login response", res.data);
    } catch (err) {
      console.error("Error en login", err);
    }
  });
}
