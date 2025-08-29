import axios from "axios";
import { redirecto } from "../../router";

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
      const user =await res.data.users
     localStorage.setItem("current", JSON.stringify(user))
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
