import { setupDashboard } from "@/js/setupDashboardDoctor";
import { setupLogin } from "@/js/setupLogin";
import { setupRegister } from "@/js/setupRegister";

const routes = {
  "/": {
    path: "/views/login.html",
    setup: setupLogin,
  },
  "/register": {
    path: "/views/register.html",
    setup: setupRegister,
  },
  "/dashboard": {
    path: "/views/dashboard.html",
    setup: setupDashboard,
  },
  "/dashboardDoctor": {
    path: "/views/dashboardDoctor.html",
    setup: setupDashboard,
  },
  "/notfound": {
    path: "/views/404.html",
  },
};

export async function renderRouter() {
  const app = document.getElementById("app");
  const path = window.location.pathname;
  const route = routes[path] || routes["/notfound"];

  try {
    const file = await fetch(route.path);
    const content = await file.text();
    app.innerHTML = content;
    // route protection
    // if user is not authenticated and wants to enter dashboard, redirect to login
    if (
      (path === "/dashboard" || path === "/dashboardDoctor") &&
      !localStorage.getItem("current")
    ) {
      window.history.replaceState({}, "", "/");
      return renderRouter();
    }
    // if user is authenticated and wants to enter login or register, redirect to dashboardDoctor

    if (
      (path === "/" || path === "/register") &&
      localStorage.getItem("current")
    ) {
      window.history.replaceState({}, "", "/dashboardDoctor");
      return renderRouter();
    }

    // if user tries to access a route that doesn't exist, redirect to 404
    if (!routes[path]) {
      window.history.replaceState({}, "", "/notfound");
      return renderRouter();
    }
    if (route.setup) {
      route.setup();
    }
  } catch (error) {
    console.error("Error loading the page:", error);
    app.innerHTML = "<h1>Error loading the page</h1>";
  }
}
export function redirecto(path) {
  window.history.replaceState({}, "", `${path}`);
  return renderRouter();
}
