import { setupDashboard } from "@/js/setupDashboard";
import { setupDashboardDoctor } from "@/js/setupDashboardDoctor";
import { setupLogin } from "@/js/setupLogin";
import { setupRegister } from "@/js/setupRegister";
import { templates } from "@/views/templates";

const routes = {
  "/": {
    template: "login",
    setup: setupLogin,
  },
  "/register": {
    template: "register",
    setup: setupRegister,
  },
  "/dashboard": {
    template: "dashboard",
    setup: setupDashboard,
  },
  "/dashboardDoctor": {
    template: "dashboardDoctor",
    setup: setupDashboardDoctor,
  },
  "/notfound": {
    template: "notfound",
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
    console.log(`Loading route: ${path}`);
    
    // Get template from templates object instead of fetching files
    const templateName = route.template;
    if (!templates[templateName]) {
      console.error(`Template ${templateName} not found`);
      throw new Error(`Template ${templateName} not found`);
    }
    
    const content = templates[templateName];
    app.innerHTML = content;
    console.log(`Content loaded for ${templateName} template`);

    // Execute route-specific setup function if available
    if (route.setup) {
      // Wait for the DOM to be updated before running setup
      setTimeout(() => {
        console.log(`Executing setup for ${templateName}`);
        route.setup();
      }, 0);
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
}

export function redirecto(path) {
  window.history.replaceState({}, "", `${path}`);
  return renderRouter();
}
