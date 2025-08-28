import { setupRegister } from "@/js/setupRegister";


const routes = {
  "/": {
    path: "/views/login.html",
    
   
  },
  "/register": {
    path: "/views/register.html",
    setup:setupRegister
  },
  "/dashboard": {
    path: "/views/dashboard.html",
  },
  "/dashboardDoctor": {
    path: "/views/dashboardDoctor.html",
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


    if (route.setup) {
  route.setup()
  
}

    
  } catch (error) {
    console.log("no se encontro la ruta ", error);
  }
}



export function redirecto(path) {
  window.history.replaceState({}, "", `${path}`);
  return renderRouter();
}

