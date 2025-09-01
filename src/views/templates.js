// HTML templates for different views
import { synapticLogo } from '@/assets/index.js';

export const templates = {
  login: `
<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-96">
    
    <!-- Logo Synaptic -->
    <div class="flex justify-center mb-6">
      <img src="${synapticLogo}" alt="Synaptic Logo" class="h-16 w-auto">
    </div>
    
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

    <form id="loginForm" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input id="email" name="email" type="email" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email" />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input id="password" name="password" type="password" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password" />
      </div>

      <button type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer">
        Sign In
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Don't have an account?
      <a href="/register" class="text-blue-600 hover:text-blue-500 font-medium">Sign up here</a>
    </p>
  </div>
</div>
  `,

  register: `
<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-md w-96">
    
    <!-- Logo Synaptic -->
    <div class="flex justify-center mb-6">
      <img src="${synapticLogo}" alt="Synaptic Logo" class="h-16 w-auto">
    </div>
    
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

    <form id="registerForm" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <input id="name" name="name" type="text" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name" />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input id="email" name="email" type="email" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email" />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input id="password" name="password" type="password" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password" />
      </div>

      <div>
        <label for="role" class="block text-sm font-medium text-gray-700 mb-2">Role</label>
        <select id="role" name="role" required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select your role</option>
          <option value="2">Doctor</option>
          <option value="3">Patient</option>
        </select>
      </div>

      <button type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer">
        Sign Up
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Already have an account?
      <a href="/" class="text-blue-600 hover:text-blue-500 font-medium">Sign in here</a>
    </p>
  </div>
</div>
  `,

  dashboard: `
<div class="flex h-screen bg-gray-50 font-sans">
  <!-- Sidebar -->
  <div class="w-72 bg-sidebar-bg border-r border-gray-200 flex flex-col">
    <!-- Logo Synaptic -->
    <div class="flex justify-center py-6 border-b border-gray-200">
      <img src="${synapticLogo}" alt="Synaptic Logo" class="h-16 w-auto">
    </div>

    <!-- Dashboard Title -->
    <div class="p-6 border-b border-gray-200">
      <h1 class="text-xl font-medium text-gray-800">SynapTic</h1>
    </div>

    <!-- Info User Section -->
    <div class="p-6 flex-1">
      <h2 class="text-lg font-medium text-gray-800 mb-4">Info user</h2>
      <div class="space-y-3">
        <div class="flex items-center text-gray-600">
          <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
          </svg>
          <span id="user-name">Loading...</span>
        </div>
        <div class="flex items-center text-gray-600">
          <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
          <span id="user-email">Loading...</span>
        </div>
        <div class="flex items-center text-gray-600">
          <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
          </svg>
          <span id="user-phone">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Exit Button -->
    <div class="p-6">
      <button id="logout-button"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
        </svg>
        Exit
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex">
    <!-- Appointments Section -->
    <div class="flex-1 p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Appointments for <span id="selected-date-display">Today</span></h1>
        <button id="create-appointment-button"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          create appointment
        </button>
      </div>

      <!-- Appointments List -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4" id="appointments-list-title">Today's Appointments</h2>
        <div class="space-y-4" id="appointments-list">
          <!-- Appointments will be rendered here -->
          <p class="text-gray-500 text-center" id="no-appointments-message">No appointments for this day.</p>
        </div>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="w-80 p-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">Calendar</h2>
        </div>

        <div class="flex items-center justify-between mb-4">
          <button id="prev-month-btn" class="p-1 hover:bg-gray-100 rounded">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
          <h3 class="font-medium text-gray-800" id="current-month-year"></h3>
          <button id="next-month-btn" class="p-1 hover:bg-gray-100 rounded">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1 text-center text-xs" id="calendar-grid">
          <!-- Days of week -->
          <div class="font-medium text-gray-500 py-2">Sun</div>
          <div class="font-medium text-gray-500 py-2">Mon</div>
          <div class="font-medium text-gray-500 py-2">Tue</div>
          <div class="font-medium text-gray-500 py-2">Wed</div>
          <div class="font-medium text-gray-500 py-2">Thu</div>
          <div class="font-medium text-gray-500 py-2">Fri</div>
          <div class="font-medium text-gray-500 py-2">Sat</div>
          <!-- Calendar days will be rendered here -->
        </div>

        <!-- Legend -->
        <div class="flex items-center justify-center space-x-4 mt-4 text-xs">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
            <span class="text-gray-600">Today</span>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            <span class="text-gray-600">Has appointments</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div id="appointment-modal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center hidden">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">

      <!-- Encabezado -->
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Agendar Cita</h2>
        <button id="close-modal-btn" class="text-gray-500 hover:text-gray-800 text-lg">&times;</button>
      </div>

      <!-- Formulario -->
      <form id="appointment-form" class="space-y-4">
        <!-- Doctor -->
        <div>
          <label for="doctor" class="block text-sm font-medium text-gray-700">Doctor</label>
          <select id="doctor-select" name="doctor"
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
            <option value="">Selecciona un doctor</option>
          </select>
        </div>

        <!-- Fecha -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Fecha</label>
          <input type="date" id="date" name="date"
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
        </div>

        <!-- Hora -->
        <div>
          <label for="time" class="block text-sm font-medium text-gray-700">Hora</label>
          <input type="time" id="time" name="time"
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
        </div>

        <!-- Motivo -->
        <div>
          <label for="reason" class="block text-sm font-medium text-gray-700">Motivo</label>
          <textarea id="reason" name="reason" rows="3"
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"></textarea>
        </div>

        <!-- Botón -->
        <div class="pt-2">
          <button type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow">
            Guardar Cita
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  `,

  dashboardDoctor: `
<div class="flex h-screen bg-gray-50 font-sans">
  <!-- Sidebar -->
  <div class="w-72 bg-sidebar-bg border-r border-gray-200 flex flex-col">
    <!-- Logo Synaptic -->
    <div class="flex justify-center py-6 border-b border-gray-200">
      <img src="${synapticLogo}" alt="Synaptic Logo" class="h-16 w-auto">
    </div>
    <!-- Dashboard Title -->
    <div class="p-6 border-b border-gray-200">
      <h1 class="text-xl font-medium text-gray-800">SynapTic</h1>
    </div>

    <!-- Welcome Section -->
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-lg text-center font-medium text-gray-00 mb-4">Welcome</h2>
      <div class="flex justify-center">
        <div id="firsletter" class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
          <p class="text-white text-lg  "></p>
        </div>
      </div>
    </div>

    <!-- Info User Section -->
    <div class="p-6 flex-1">
      <h2 class="text-lg font-medium text-gray-800 mb-4">Info user</h2>
      <div class="space-y-3" id="info-user">
      </div>
    </div>

    <!-- Exit Button -->
    <div class="p-6">
      <button id="exit"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenod"
            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
            clip-rule="evenodd"></path>
        </svg>
        Exit
      </button>
    </div>
  </div>

  <div class="flex-1 flex " id="content-page">
    <div class="flex-1 p-6 " id="content-citas">
    </div>

    <div class="calendar-container">
      <p>Haz click en un día para ver las citas</p>
      <div id="calendar">
      </div>
    </div>
  </div>
</div>
  `,

  notfound: `
<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
    <p class="text-gray-500 mb-8">The page you are looking for doesn't exist.</p>
    <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">
      Go Back Home
    </a>
  </div>
</div>
  `
};
