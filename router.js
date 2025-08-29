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

// get role from local storage
function getUserRole() {
  const user = JSON.parse(localStorage.getItem("current"));
  return user ? user.role : null;
}

// protect routes based on role
function isRouteAllowed(path) {
  const role = getUserRole();
  if (path === "/dashboard" && role !== 3) return false; // only role 3 (patient) can access /dashboard
  if (path === "/dashboardDoctor" && role !== 2) return false; // only role 2 (doctor) can access /dashboardDoctor
  return true;
}

export async function renderRouter() {
  const app = document.getElementById("app");
  const path = window.location.pathname;
  const route = routes[path] || routes["/notfound"];

  try {
    const file = await fetch(route.path);
    const content = await file.text();
    app.innerHTML = content;

    // guardian
    // Check if user has permission to access the current route
    if (!isRouteAllowed(path)) {
      window.history.replaceState({}, "", "/notfound");
      return renderRouter();
    }

    // Redirect authenticated users away from auth pages to their appropriate dashboard
    const userRole = getUserRole();
    const isAuthPage = path === "/" || path === "/register";

    if (isAuthPage && userRole) {
      const redirectPath = userRole === 2 ? "/dashboardDoctor" : "/dashboard";
      window.history.replaceState({}, "", redirectPath);
      return renderRouter();
    }

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
