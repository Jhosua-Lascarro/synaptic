import { setupDashboard } from "./src/js/setupDashboard";
import { setupDashboardDoctor } from "./src/js/setupDashboardDoctor";
import { setupLogin } from "./src/js/setupLogin";
import { setupRegister } from "./src/js/setupRegister";

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
    setup: setupDashboardDoctor,
  },
  "/notfound": {
    path: "/views/404.html",
  },
};

// get role from local storage
function getUserRole() {
  const user = JSON.parse(localStorage.getItem("current"));
  return user ? user.role : null;
}

// protect routes based on role
function isRouteAllowed(path, role = null) {
  const userRole = role || getUserRole();
  if (path === "/dashboard" && userRole !== 3) return false;
  if (path === "/dashboardDoctor" && userRole !== 2) return false;
  return true;
}

export async function renderRouter() {
  const app = document.getElementById("app");
  const path = window.location.pathname;
  const route = routes[path] || routes["/notfound"];
  const userRole = getUserRole();
  const isAuthPage = path === "/" || path === "/register";
  const isDashboardPage = path === "/dashboard" || path === "/dashboardDoctor";

  try {
    // Redirect unauthenticated users away from dashboard pages
    if (isDashboardPage && !userRole) {
      window.history.replaceState({}, "", "/");
      return renderRouter();
    }

    // Check if authenticated user has permission to access the current route
    if (userRole && !isRouteAllowed(path, userRole)) {
      window.history.replaceState({}, "", "/notfound");
      return renderRouter();
    }

    // Redirect authenticated users away from auth pages to their appropriate dashboard
    if (isAuthPage && userRole) {
      const redirectPath = userRole === 2 ? "/dashboardDoctor" : "/dashboard";
      window.history.replaceState({}, "", redirectPath);
      return renderRouter();
    }

    // Load and render the page content
    const file = await fetch(route.path);
    const content = await file.text();
    app.innerHTML = content;

    // Execute route-specific setup function if available
    if (route.setup) {
      route.setup();
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
}

export function redirecto(path) {
  window.history.replaceState({}, "", `${path}`);
  return renderRouter();
}
