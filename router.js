import {login} from "./auth/login.js";
// import { register } from "./controllers/register";
// routes de acces
const routes = {
  "/": "/src/views/home.html",
  "/login": "/src/views/login.html",
  "/register": "/src/views/register.html",
//   "/notFound": "/src/views/404.html",
};

export async function renderRoute() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const path = location.pathname;
  const app = document.getElementById("app");
  const isAuth = localStorage.getItem("isAuth");

  const file = routes[path];
  if (!file) {
    location.href = "/notFound";
    return;
  }
  if (isAuth && path === "/login") {
    location.pathname = "/";
    return;
  }
 
  try {
    const res = await fetch(file);
    const html = await res.text();
    app.innerHTML = html;

    const principalHeader = document.getElementById("principal-header");
    if (principalHeader) {
      principalHeader.hidden = (path === "/login" || path === "/register" || path === "/notFound");
    }

    if (path === "/tasks") {

      const createButton = document.getElementById("create-button");
      const containerForm = document.getElementById("container-form");
      const sendFormButton = document.getElementById("sendForm");

      if (userRole === "visit") {
        if (createButton) createButton.hidden = true;
      }
      let allTasksData = await getData();
      fillTable(allTasksData, userRole);

      document.getElementById("sendForm").addEventListener("click", () => {
        const button = document.getElementById("sendForm");
        button.disabled = true;

        const name = document.getElementById("grid-first-name").value;
        const lastname = document.getElementById("grid-last-name").value;
        const identification = document.getElementById(
          "grid-identification"
        ).value;

        if (!name || !lastname || !identification) {
          alert("Todos los campos son requeridos");
          button.disabled = false;
          return;
        }

        const form = {
          name: name,
          lastname: lastname,
          identification: identification,
          created: new Date().toISOString(),
        };
        sendData(form);
        button.disabled = false;
      });

      document
        .getElementById("editForm")
        .addEventListener("click", async () => {
          const name = document.getElementById("grid-first-name").value;
          const lastname = document.getElementById("grid-last-name").value;
          const identification = document.getElementById(
            "grid-identification"
          ).value;

          if (!name || !lastname || !identification) {
            alert("Todos los campos son requeridos");
            return;
          }

          const form = {
            name,
            lastname,
            identification,
            created: new Date().toISOString(),
          };

          await updateTasks(form);
          location.reload();
        });

      document.getElementById("cancelForm").addEventListener("click", () => {
        clearEditId();
        document.getElementById("grid-first-name").value = "";
        document.getElementById("grid-last-name").value = "";
        document.getElementById("grid-identification").value = "";

        document.getElementById("sendForm").hidden = false;
        document.getElementById("btn-container").hidden = true;
        document.getElementById("container-form").hidden = true;
        const textEdit = document.getElementById("edit-text");
        textEdit.hidden = true;
        textEdit.textContent = "";
      });

      document.getElementById("cancelForm_1").addEventListener("click", () => {
        document.getElementById("create-button").hidden = false;
        document.getElementById("container-form").hidden = true;
      });

      document.getElementById("search").addEventListener("change", (e) => {
        if (!e.target.value) {
          fillTable(allTasksData);
        } else {
          const data = searchData(e.target.value, allTasksData);
          fillTable(data);
        }
      });

      document.getElementById("create-button").addEventListener("click", () => {
        document.getElementById("create-button").hidden = true;
        document.getElementById("container-form").hidden = false;
        document.getElementById("cancelForm_1").hidden = false;
      });
    }
    if (path === "/register") {
      document.getElementById("principal-header").hidden = true;
      register();
    }
    if (path === "/login") {
      document.getElementById("principal-header").hidden = true;
      document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const params = {
          email: email,
          password: password,
        };
        const login_ = login(params);
        if (login_) {
          location.href = "/";
        }
      });
    }
    const logOutButton = document.getElementById("logOut");
    if (logOutButton) {
      logOutButton.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuth");
        location.href = "/login";
      });
    }
  }
}