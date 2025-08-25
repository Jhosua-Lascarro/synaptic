const userURL = "http://localhost:3000";

 export async function login({ email, password }) {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const params = {
      email: email,
      password: password,
    };
    try {
      const resp = await axios.get(`${userURL}/auth/login`, {
        params: { email, password },
      });
      const users = resp.data;

      if (users.length === 0) {
        alert("Usuario o contraseña inválido");
        return false;
      }

      const user = users[0];
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuth", true);
      return true;

    } catch (error) {
      console.log(error);
      alert("ocurrió un error inesperado");
    }
    if (login) {
      location.href = "/";
      }
    // const login_ = login(params);
    // if (login_) {
    //   alert("estoy adentro");
    // }
  });
}

