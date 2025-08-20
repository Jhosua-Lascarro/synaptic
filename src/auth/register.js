
const userURL = "http://localhost:3000";

export function register() {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repeatPassword =document.getElementById("repeat_password").value;


    if (password!==repeatPassword) {
        return alert("no coninciden")
        
    }


    try {
      const resp = await axios.post(`${userURL}/auth/register`, {
        username,
        email,
        password,
        role:2,
      });

      const newUser = resp.data;
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("isAuth", "true");

      alert("Registro exitoso");
      location.pathname = "/login";
    } catch (error) {
      console.error(error);
      alert("Error al registrar el usuario");
    }
  });
}
