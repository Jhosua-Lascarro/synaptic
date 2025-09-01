import axios from 'axios';

export async function setupDashboard() {
    axios.defaults.baseURL = 'http://localhost:3000';

    // --- Estatus global ---
    let currentUser = null;
    let currentUserId = null;
    let currentPatientId = null;
    let currentDoctorId = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let allMonthlyAppointments = [];
    let selectedDate = new Date();

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const statusMap = { 1: 'Confirmada', 2: 'Cancelada' };

    // --- DOM elements ---
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

    //  Modal
    const appointmentModal = document.getElementById('appointment-modal');
    const appointmentForm = document.getElementById('appointment-form');
    const doctorSelect = document.getElementById('doctor-select');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- utilies ---
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTime(dateTimeString) {
        const d = new Date(dateTimeString);
        return d.toLocaleTimeString('es-ES',
            { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    // --- API ---
    async function fetchUserData() {
        if (!currentUserId) return;
        try {
            const response = await axios.get(`/users/${currentUserId}`);
            const userDetails = response.data;
            userNameElement.textContent = userDetails.fullname || 'N/A';
            userEmailElement.textContent = userDetails.email || 'N/A';
            userPhoneElement.textContent = userDetails.phone || 'No disponible';
        } catch (error) {
            console.error('fetchUserData:', error);
        }
    }

    async function fetchPatientOrDoctorId() {
        if (!currentUser || !currentUserId) return;

        if (currentUser.role === 3) { // Paciente
            try {
                const response = await axios.get(`/patients/user/${currentUserId}`);
                currentPatientId = response.data.id;
            } catch (error) {
                console.error('Error fetching patient ID:', error);
            }
        } else if (currentUser.role === 2) { // Doctor
            try {
                const response = await axios.get(`/doctors/user/${currentUserId}`);
                currentDoctorId = response.data.id;
            } catch (error) {
                console.error('Error fetching doctor ID:', error);
            }
        }
    }

    async function fetchMonthlyAppointments(year, month) {
        let endpoint = '';
        if (currentUser.role === 3 && currentPatientId) {
            endpoint = `/appointments/patient/${currentPatientId}/month/${year}/${month + 1}`;
        } else if (currentUser.role === 2 && currentDoctorId) {
            endpoint = `/appointments/doctor/${currentDoctorId}/month/${year}/${month + 1}`;
        } else {
            return [];
        }

        try {
            const response = await axios.get(endpoint);
            allMonthlyAppointments = response.data;

            // Solo citas confirmadas se marcan en el calendario
            const appointmentDates = new Set(
                allMonthlyAppointments.filter(a => a.status_id === 1)
                    .map(a => formatDate(a.appointment_date))
            );
            return Array.from(appointmentDates);
        } catch (error) {
            console.error('fetchMonthlyAppointments:', error);
            allMonthlyAppointments = [];
            return [];
        }
    }

    async function loadDoctors() {
        try {
            const resp = await axios.get("/doctors/summary");
            const doctors = resp.data || [];

            if (!Array.isArray(doctors) || doctors.length === 0) {
                doctorSelect.innerHTML = `<option value="">No hay doctores disponibles</option>`;
                return;
            }

            doctorSelect.innerHTML = doctors
                .map((d) => {
                    const labelParts = [];
                    labelParts.push(d.fullname || `Doctor #${d.id}`);
                    if (d.primary_specialty) labelParts.push(`– ${d.primary_specialty}`);
                    return `<option value="${d.id}">${labelParts.join(" ")}</option>`;
                })
                .join("");
        } catch (error) {
            console.error("Error cargando doctores:", error);
            doctorSelect.innerHTML = `<option value="">Error cargando doctores</option>`;
        }
    }

    async function createAppointment(formData) {
        const date = formData.get('date');
        const time = formData.get('time');
        const appointmentDateTime = `${date} ${time}:00`;

        const newAppointment = {
            patient_id: currentPatientId,
            doctor_id: formData.get('doctor'),
            appointment_date: appointmentDateTime,
            status_id: 1,
            reason: formData.get('reason'),
            notes: formData.get('notes') || null
        };

        try {
            await axios.post("/appointments", newAppointment);
            alert("Cita creada con éxito");
            closeModal();
            appointmentForm.reset();
            await updateCalendarAndAppointments();
        } catch (error) {
            console.error("Error creando cita:", error);
            alert("Error al crear la cita");
        }
    }

    async function updateAppointmentStatus(id, newStatus) {
        try {
            await axios.patch(`/appointments/${id}`, { status_id: newStatus });
            await updateCalendarAndAppointments();
        } catch (error) {
            console.error("Error actualizando estado:", error);
            alert("No se pudo actualizar el estado");
        }
    }

    // --- UI ---
    function renderCalendar(year, month, datesWithAppointments = []) {
        currentMonthYearElement.textContent = `${months[month]} ${year}`;
        calendarGrid.innerHTML = '';

        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        daysOfWeek.forEach(day => {
            const el = document.createElement('div');
            el.className = 'font-medium text-gray-500 py-2 text-sm';
            el.textContent = day;
            calendarGrid.appendChild(el);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayFormatted = formatDate(new Date());

        for (let i = 0; i < firstDay; i++) calendarGrid.appendChild(document.createElement('div'));

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const formattedDate = formatDate(date);
            const el = document.createElement('div');
            el.className = 'calendar-day';
            if (datesWithAppointments.includes(formattedDate)) el.classList.add('day-with-appointment');
            if (formattedDate === todayFormatted) el.classList.add('today');
            if (formattedDate === formatDate(selectedDate)) el.classList.add('selected');
            el.textContent = day;
            el.dataset.date = formattedDate;
            el.addEventListener('click', () => {
                selectedDate = date;
                renderCalendar(year, month, datesWithAppointments);
                displayAppointments(selectedDate);
            });
            calendarGrid.appendChild(el);
        }
    }

    async function updateCalendarAndAppointments() {
        const dates = await fetchMonthlyAppointments(currentYear, currentMonth);
        renderCalendar(currentYear, currentMonth, dates);
        displayAppointments(selectedDate);
    }

    function displayAppointments(date) {
        appointmentsList.innerHTML = '';
        noAppointmentsMessage.classList.add('hidden');
        appointmentsList.classList.remove('hidden');

        const dateString = new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        selectedDateDisplay.textContent = `el ${dateString}`;
        appointmentsListTitle.textContent = `Citas del ${dateString}`;

        const formattedDate = formatDate(date);
        const apps = allMonthlyAppointments.filter(a => formatDate(a.appointment_date) === formattedDate);

        if (apps.length === 0) {
            noAppointmentsMessage.classList.remove('hidden');
            appointmentsList.classList.add('hidden');
            return;
        }

        apps.sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

        apps.forEach(app => {
            const div = document.createElement('div');
            div.className = `rounded-lg p-4 border mb-2 ${app.status_id === 2
                ? 'bg-gray-100 border-gray-300 text-gray-500'
                : 'bg-white border-gray-200'}`;

            const participantName = currentUser.role === 3 ? app.doctor_name : app.patient_name;
            const participantRole = currentUser.role === 3 ? 'Dr.' : 'Paciente:';

            div.innerHTML = `
                <div class="flex justify-between items-center">
                    <p class="font-bold text-blue-600">${formatTime(app.appointment_date)}</p>
                    <select class="status-select border rounded p-1 text-sm" data-id="${app.id}">
                        <option value="1" ${app.status_id === 1 ? 'selected' : ''}>Confirmada</option>
                        <option value="2" ${app.status_id === 2 ? 'selected' : ''}>Cancelada</option>
                    </select>
                </div>
                <div class="mt-2">
                    <h3 class="font-semibold text-gray-800">${participantRole} ${participantName}</h3>
                    <p class="text-sm">Motivo: ${app.reason || 'No especificado'}</p>
                </div>
            `;

            appointmentsList.appendChild(div);
        });

        // Escuchar cambios en los selects de estado
        document.querySelectorAll(".status-select").forEach(select => {
            select.addEventListener("change", (e) => {
                const appointmentId = e.target.dataset.id;
                const newStatus = Number.parseInt(e.target.value);
                updateAppointmentStatus(appointmentId, newStatus);
            });
        });
    }

    function logout() {
        localStorage.removeItem('current');
        window.location.href = '/';
    }

    function openModal() {
        appointmentModal.classList.remove('hidden');
        loadDoctors();
    }

    function closeModal() {
        appointmentModal.classList.add('hidden');
    }

    // --- Inicialización ---
    const currentStorage = localStorage.getItem('current');
    if (currentStorage) {
        currentUser = JSON.parse(currentStorage);
        currentUserId = currentUser.id;
    }
    if (!currentUser || !currentUserId) return;

    await fetchUserData();
    await fetchPatientOrDoctorId();
    selectedDate = new Date();

    await updateCalendarAndAppointments();

    // --- Events ---
    logoutButton.addEventListener('click', logout);
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        updateCalendarAndAppointments();
    });
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        updateCalendarAndAppointments();
    });

    if (currentUser.role === 3) {
        createAppointmentButton.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await createAppointment(new FormData(appointmentForm));
        });
    }
}
