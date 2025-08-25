

const routes = {
  "/": {
    path: "/src/views/login.html",
   
  },
  "/register": {
    path: "/src/views/register.html",
  },
  "/dashboard": {
    path: "/src/views/dashboard.html",
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

    
  } catch (error) {
    console.log("no se encontro la ruta ", error);
  }
}

export function redirecto(path) {
  window.history.replaceState({}, "", `${path}`);
  return renderRouter();
}
