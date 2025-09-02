import "./style.css";
import { renderRouter } from "./router"

// Handle initial page load
document.addEventListener('DOMContentLoaded', renderRouter)

// Handle browser back/forward buttons
window.addEventListener('popstate', renderRouter)

// Intercept link clicks to use router instead of full page navigation
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]')
  if (link && link.href.startsWith(window.location.origin)) {
    event.preventDefault()
    const path = link.pathname
    window.history.pushState({}, '', path)
    renderRouter()
  }
})