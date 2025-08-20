import { login } from "./login.js";
import { register } from "./register.js";
// routes de acces
const routes = {
  // "/": "/src/views/home.html",
  "/login": "/src/views/login.html",
  "/register": "/src/views/register.html",
  "/notFound": "/src/views/404.html",
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
  // Here I call the function register
    if (path === "/register") {
    register();
    }
  // Here I call the function login
    if (path === "/login") {
    login({ email, password });
    }
}