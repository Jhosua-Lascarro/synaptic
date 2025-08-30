import axios from 'axios';

// Base Axios configuration to avoid repeating the base URL
export async function setupDashboard() {
    axios.defaults.baseURL = 'http://localhost:3000';

    // Global variables for dashboard state
    let currentUser = null; // Will store the user object from localStorage
    let currentUserId = null;
    let currentPatientId = null; // Patient ID, if the user is a patient
    let currentDoctorId = null;  // Doctor ID, if the user is a doctor
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let allMonthlyAppointments = []; // Will store all appointments for the visible month
    let selectedDate = new Date(); // Default selected date is today

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    // Mapping of status_id to status names
    const statusMap = {
        1: 'Confirmada',
        2: 'Cancelada',
        // You can add more if you have other statuses
    };

    // --- DOM Elements ---
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userPhoneElement = document.getElementById('user-phone');
    const logoutButton = document.getElementById('logout-button');
    const currentMonthYearElement = document.getElementById('current-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const appointmentsList = document.getElementById('appointments-list');
    const noAppointmentsMessage = document.getElementById('no-appointments-message');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const appointmentsListTitle = document.getElementById('appointments-list-title');
    const createAppointmentButton = document.getElementById('create-appointment-button');


    // --- Utility Functions ---

    // Function to format a date as 'YYYY-MM-DD'
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to format a time as 'HH:MM AM/PM'
    function formatTime(dateTimeString) {
        // Assuming appointment_date already has the time or needs to be extracted from a separate time field if exists.
        // If appointment_date is a full timestamp, we can format it directly.
        const d = new Date(dateTimeString);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    }


    // --- Business Logic Functions ---

    async function fetchUserData() {
        if (!currentUser || !currentUserId) {
            console.error("fetchUserData: currentUser or currentUserId not found.");
            return;
        }

        try {
            // Endpoint to get user data directly from the users table
            const response = await axios.get(`/users/${currentUserId}`);
            const userDetails = response.data; // Expecting { fullname, email, phone, etc. }
            userNameElement.textContent = userDetails.fullname || 'N/A';
            userEmailElement.textContent = userDetails.email || 'N/A';
            userPhoneElement.textContent = userDetails.phone || 'N/A';
        } catch (error) {
            console.error('fetchUserData: Error getting user data:', error);
            if (error.response) {
                console.error('fetchUserData: Server error response:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('fetchUserData: No response received from server.');
            }
            userNameElement.textContent = 'Error';
            userEmailElement.textContent = 'Error';
            userPhoneElement.textContent = 'Error';
        }
    }

    async function fetchPatientOrDoctorId() {
        if (!currentUser || !currentUserId) {
            console.error("fetchPatientOrDoctorId: No currentUser to determine role.");
            return;
        }

        if (currentUser.role === 3) { // Patient
            try {
                const response = await axios.get(`/patients/user/${currentUserId}`);
                currentPatientId = response.data.id;
            } catch (error) {
                console.error('Error fetching patient ID:', error);
                currentPatientId = null;
            }
        } else if (currentUser.role === 2) { // Doctor
            try {
                const response = await axios.get(`/doctors/user/${currentUserId}`);
                currentDoctorId = response.data.id;
            } catch (error) {
                console.error('Error fetching doctor ID:', error);
                currentDoctorId = null;
            }
        } else {
            console.warn("fetchPatientOrDoctorId: User role not recognized or not applicable for appointments.");
        }
    }

    async function fetchMonthlyAppointments(year, month) {
        let appointmentsEndpoint = '';
        let idToFetch = null;

        if (currentUser.role === 3 && currentPatientId) { // Is patient
            appointmentsEndpoint = `/appointments/patient/${currentPatientId}/month/${year}/${month + 1}`;
            idToFetch = currentPatientId;
        } else if (currentUser.role === 2 && currentDoctorId) { // Is doctor
            appointmentsEndpoint = `/appointments/doctor/${currentDoctorId}/month/${year}/${month + 1}`;
            idToFetch = currentDoctorId;
        } else {
            console.error("fetchMonthlyAppointments: No patient/doctor ID or valid role to get appointments.");
            return [];
        }

        try {
            const response = await axios.get(appointmentsEndpoint);
            allMonthlyAppointments = response.data; // Save all appointments for the month

            // Extract only dates with 'confirmed' appointments (status_id = 1) to mark them on the calendar
            const appointmentDates = new Set(allMonthlyAppointments
                .filter(app => app.status_id === 1) // Filter by status_id for 'confirmed'
                .map(app => formatDate(app.appointment_date)));
            return Array.from(appointmentDates);
        } catch (error) {
            console.error('fetchMonthlyAppointments: Error getting monthly appointments:', error);
            if (error.response) {
                console.error('fetchMonthlyAppointments: Server error response:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('fetchMonthlyAppointments: No response received from server.');
            }
            return [];
        }
    }

    function renderCalendar(year, month, datesWithAppointments = []) {
        currentMonthYearElement.textContent = `${months[month]} ${year}`;
        calendarGrid.innerHTML = ''; // Clear previous days

        // Add days of the week
        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'font-medium text-gray-500 py-2';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const todayFormatted = formatDate(today);

        // Fill empty days at the beginning of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'py-2 text-gray-400';
            calendarGrid.appendChild(emptyDay);
        }

        // Render days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const date = new Date(year, month, day);
            const formattedDate = formatDate(date);

            let classList = ['calendar-day'];

            if (datesWithAppointments.includes(formattedDate)) {
                classList.push('day-with-appointment');
            }

            // If it's today, add the 'today' class
            if (formattedDate === todayFormatted && year === today.getFullYear() && month === today.getMonth()) {
                classList.push('today');
            }

            // If it's the selected day, add the 'selected' class
            if (formattedDate === formatDate(selectedDate)) {
                const todayIndex = classList.indexOf('today');
                if (todayIndex > -1) {
                    classList.splice(todayIndex, 1);
                }
                classList.push('selected');
            }

            dayElement.className = classList.join(' ');
            dayElement.textContent = day;
            dayElement.dataset.date = formattedDate; // Save the full date in a data attribute

            dayElement.addEventListener('click', () => {
                selectedDate = date; // Update the globally selected date
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                    if (formatDate(new Date(el.dataset.date)) === todayFormatted && year === today.getFullYear() && month === today.getMonth()) {
                        el.classList.add('today');
                    }
                });
                dayElement.classList.add('selected');
                dayElement.classList.remove('today');
                displayAppointments(selectedDate); // Show appointments for the selected day
            });
            calendarGrid.appendChild(dayElement);
        }

        const selectedDayElement = document.querySelector(`.calendar-day[data-date="${formatDate(selectedDate)}"]`);
        if (selectedDayElement) {
            selectedDayElement.classList.remove('today');
            selectedDayElement.classList.add('selected');
        }
    }

    async function updateCalendarAndAppointments() {
        const datesWithAppointments = await fetchMonthlyAppointments(currentYear, currentMonth);
        renderCalendar(currentYear, currentMonth, datesWithAppointments);
        displayAppointments(selectedDate);
    }

    function displayAppointments(date) {
        appointmentsList.innerHTML = ''; // Clear previous appointments
        noAppointmentsMessage.classList.add('hidden'); // Hide the default message

        selectedDateDisplay.textContent = new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        appointmentsListTitle.textContent = `Citas para el ${new Date(date).toLocaleDateString('es-ES')}`;


        const formattedSelectedDate = formatDate(date);
        const appointmentsForSelectedDay = allMonthlyAppointments.filter(app => formatDate(app.appointment_date) === formattedSelectedDate);

        if (appointmentsForSelectedDay.length === 0) {
            noAppointmentsMessage.classList.remove('hidden'); // Show message if no appointments
            return;
        }

        appointmentsForSelectedDay.forEach(appointment => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'bg-gray-50 rounded-lg p-4 flex justify-between items-start';

            const statusName = statusMap[appointment.status_id] || 'Desconocido';
            let statusClass = 'text-gray-700'; // Default color

            switch (appointment.status_id) {
                case 1: // confirmed
                    statusClass = 'text-green-600';
                    break;
                case 2: // canceled
                    statusClass = 'text-red-600';
                    break;
                default:
                    statusClass = 'text-gray-700';
            }

            let participantName = 'N/A';
            let participantRole = '';

            if (currentUser.role === 3) { // If the logged user is a patient, show the doctor's name
                participantName = appointment.doctor_name || 'N/A';
                participantRole = 'Dr.';
            } else if (currentUser.role === 2) { // If the logged user is a doctor, show the patient's name
                participantName = appointment.patient_name || 'N/A';
                participantRole = 'Paciente:';
            }

            appointmentDiv.innerHTML = `
                <div>
                    <h3 class="font-medium text-gray-800">${participantRole} ${participantName} - <span class="${statusClass}">${statusName}</span></h3>
                    <p class="text-sm text-gray-600 mt-1">Motivo: ${appointment.reason || 'N/A'}</p>
                    <p class="text-sm text-gray-600">Fecha/Hora: ${formatTime(appointment.appointment_date)}</p>
                </div>
                <span class="text-sm font-medium ${statusClass}">${statusName}</span>
            `;
            appointmentsList.appendChild(appointmentDiv);
        });
    }

    function logout() {
        localStorage.removeItem('current'); // Clear the 'current' key
        window.location.href = '/login'; // Redirect to the login page
    }

    // --- Dashboard Initialization ---
    const currentStorage = localStorage.getItem('current');
    if (currentStorage) {
        currentUser = JSON.parse(currentStorage);
        currentUserId = currentUser.id;
    }

    // Check authentication
    if (!currentUser || !currentUserId) {
        console.warn("initDashboard: User object not found in localStorage. Redirecting to /login.");
        window.location.href = '/login';
        return;
    }

    // Load user data
    await fetchUserData();
    // Get patient_id or doctor_id according to the role
    await fetchPatientOrDoctorId();

    // Load and render the calendar and appointments for the current month
    await updateCalendarAndAppointments();

    // Make sure the current day is selected and its appointments are shown on load
    const today = new Date();
    selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());


    // --- Event Listeners ---
    logoutButton.addEventListener('click', logout);

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarAndAppointments();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarAndAppointments();
    });

    createAppointmentButton.addEventListener('click', () => {
        alert('Funcionalidad para crear cita próximamente.');
    });
}
