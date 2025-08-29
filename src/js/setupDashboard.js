import axios from 'axios';

export async function setupDashboard() {
    // Configuración base de Axios para evitar repetir la URL base
    axios.defaults.baseURL = 'http://localhost:3000';

    // Variables globales para el estado del dashboard
    let currentUser = null; // Almacenará el objeto user del localStorage
    let currentUserId = null;
    let currentPatientId = null; // ID del paciente, si el usuario es paciente
    let currentDoctorId = null;  // ID del doctor, si el usuario es doctor
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let allMonthlyAppointments = []; // Almacenará todas las citas del mes visible
    let selectedDate = new Date(); // Fecha seleccionada por defecto es hoy

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    // Mapeo de status_id a nombres de estado
    const statusMap = {
        1: 'Confirmada',
        2: 'Cancelada',
        // Puedes añadir más si tienes otros estados
    };

    // --- Elementos del DOM ---
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


    // --- Funciones de Utilidad ---

    // Función para formatear una fecha a 'YYYY-MM-DD'
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Función para formatear una hora a 'HH:MM AM/PM'
    function formatTime(dateTimeString) {
        // Asumiendo que appointment_date ya tiene la hora o que se necesita extraer de un campo de hora separado si existe.
        // Si appointment_date es un timestamp completo, podemos formatearlo directamente.
        const d = new Date(dateTimeString);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    }


    // --- Funciones de Lógica de Negocio ---

    async function fetchUserData() {
        if (!currentUser || !currentUserId) {
            console.error("fetchUserData: No se encontró currentUser o currentUserId.");
            return;
        }

        try {
            // Endpoint para obtener los datos del usuario directamente de la tabla users
            const response = await axios.get(`/users/${currentUserId}`);
            const userDetails = response.data; // Esperamos { fullname, email, phone, etc. }
            userNameElement.textContent = userDetails.fullname || 'N/A';
            userEmailElement.textContent = userDetails.email || 'N/A';
            userPhoneElement.textContent = userDetails.phone || 'N/A';
        } catch (error) {
            console.error('fetchUserData: Error al obtener datos del usuario:', error);
            if (error.response) {
                console.error('fetchUserData: Respuesta de error del servidor:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('fetchUserData: No se recibió respuesta del servidor.');
            }
            userNameElement.textContent = 'Error';
            userEmailElement.textContent = 'Error';
            userPhoneElement.textContent = 'Error';
        }
    }

    async function fetchPatientOrDoctorId() {
        if (!currentUser || !currentUserId) {
            console.error("fetchPatientOrDoctorId: No hay currentUser para determinar el rol.");
            return;
        }

        if (currentUser.role === 3) { // Paciente
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
            console.warn("fetchPatientOrDoctorId: Rol de usuario no reconocido o no aplicable para citas.");
        }
    }

    async function fetchMonthlyAppointments(year, month) {
        let appointmentsEndpoint = '';
        let idToFetch = null;

        if (currentUser.role === 3 && currentPatientId) { // Es paciente
            appointmentsEndpoint = `/appointments/patient/${currentPatientId}/month/${year}/${month + 1}`;
            idToFetch = currentPatientId;
        } else if (currentUser.role === 2 && currentDoctorId) { // Es doctor
            appointmentsEndpoint = `/appointments/doctor/${currentDoctorId}/month/${year}/${month + 1}`;
            idToFetch = currentDoctorId;
        } else {
            console.error("fetchMonthlyAppointments: No hay ID de paciente/doctor o rol válido para obtener citas.");
            return [];
        }

        try {
            const response = await axios.get(appointmentsEndpoint);
            allMonthlyAppointments = response.data; // Guardar todas las citas del mes

            // Extraer solo las fechas que tienen citas 'confirmada' (status_id = 1) para marcarlas en el calendario
            const appointmentDates = new Set(allMonthlyAppointments
                .filter(app => app.status_id === 1) // Filtrar por status_id para 'confirmada'
                .map(app => formatDate(app.appointment_date)));
            return Array.from(appointmentDates);
        } catch (error) {
            console.error('fetchMonthlyAppointments: Error al obtener citas mensuales:', error);
            if (error.response) {
                console.error('fetchMonthlyAppointments: Respuesta de error del servidor:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('fetchMonthlyAppointments: No se recibió respuesta del servidor.');
            }
            return [];
        }
    }

    function renderCalendar(year, month, datesWithAppointments = []) {
        currentMonthYearElement.textContent = `${months[month]} ${year}`;
        calendarGrid.innerHTML = ''; // Limpiar días anteriores

        // Añadir los días de la semana
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

        // Rellenar días vacíos al principio del mes
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'py-2 text-gray-400';
            calendarGrid.appendChild(emptyDay);
        }

        // Renderizar días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const date = new Date(year, month, day);
            const formattedDate = formatDate(date);

            let classList = ['calendar-day'];

            if (datesWithAppointments.includes(formattedDate)) {
                classList.push('day-with-appointment');
            }

            // Si es el día de hoy, añade la clase 'today'
            if (formattedDate === todayFormatted && year === today.getFullYear() && month === today.getMonth()) {
                classList.push('today');
            }

            // Si es el día seleccionado, añade la clase 'selected'
            if (formattedDate === formatDate(selectedDate)) {
                const todayIndex = classList.indexOf('today');
                if (todayIndex > -1) {
                    classList.splice(todayIndex, 1);
                }
                classList.push('selected');
            }

            dayElement.className = classList.join(' ');
            dayElement.textContent = day;
            dayElement.dataset.date = formattedDate; // Guardar la fecha completa en un atributo de datos

            dayElement.addEventListener('click', () => {
                selectedDate = date; // Actualiza la fecha seleccionada globalmente
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                    if (formatDate(new Date(el.dataset.date)) === todayFormatted && year === today.getFullYear() && month === today.getMonth()) {
                        el.classList.add('today');
                    }
                });
                dayElement.classList.add('selected');
                dayElement.classList.remove('today');
                displayAppointments(selectedDate); // Mostrar citas para el día seleccionado
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
        appointmentsList.innerHTML = ''; // Limpiar citas anteriores
        noAppointmentsMessage.classList.add('hidden'); // Ocultar el mensaje por defecto

        selectedDateDisplay.textContent = new Date(date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        appointmentsListTitle.textContent = `Citas para el ${new Date(date).toLocaleDateString('es-ES')}`;


        const formattedSelectedDate = formatDate(date);
        const appointmentsForSelectedDay = allMonthlyAppointments.filter(app => formatDate(app.appointment_date) === formattedSelectedDate);

        if (appointmentsForSelectedDay.length === 0) {
            noAppointmentsMessage.classList.remove('hidden'); // Mostrar mensaje si no hay citas
            return;
        }

        appointmentsForSelectedDay.forEach(appointment => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'bg-gray-50 rounded-lg p-4 flex justify-between items-start';

            const statusName = statusMap[appointment.status_id] || 'Desconocido';
            let statusClass = 'text-gray-700'; // Color por defecto

            switch (appointment.status_id) {
                case 1: // confirmada
                    statusClass = 'text-green-600';
                    break;
                case 2: // cancelada
                    statusClass = 'text-red-600';
                    break;
                default:
                    statusClass = 'text-gray-700';
            }

            let participantName = 'N/A';
            let participantRole = '';

            if (currentUser.role === 3) { // Si el usuario logeado es paciente, muestra el nombre del doctor
                participantName = appointment.doctor_name || 'N/A';
                participantRole = 'Dr.';
            } else if (currentUser.role === 2) { // Si el usuario logeado es doctor, muestra el nombre del paciente
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
        localStorage.removeItem('current'); // Limpiar la clave 'current'
        window.location.href = '/login'; // Redirigir a la página de login
    }

    // --- Inicialización del Dashboard ---
    const currentStorage = localStorage.getItem('current');
    if (currentStorage) {
        currentUser = JSON.parse(currentStorage);
        currentUserId = currentUser.id;
    }

    // Verificar autenticación
    if (!currentUser || !currentUserId) {
        console.warn("initDashboard: Objeto de usuario no encontrado en localStorage. Redirigiendo a /login.");
        window.location.href = '/login';
        return;
    }

    // Cargar datos del usuario
    await fetchUserData();
    // Obtener patient_id o doctor_id según el rol
    await fetchPatientOrDoctorId();

    // Cargar y renderizar el calendario y las citas para el mes actual
    await updateCalendarAndAppointments();

    // Asegurarse de que el día actual esté seleccionado y sus citas se muestren al cargar
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
