import bcrypt from "bcrypt";
import cors from "cors";
import express from "express";
import { supabase } from "./conection_db.js"; // Asegúrate de que esta ruta sea correcta para tu configuración de Supabase

const app = express();

app.use(express.json());
app.use(cors());

// --- Endpoints de USUARIOS (CRUD Básico y Autenticación) ---

// Endpoint de prueba (original)
app.get("/", async (request, response) => {
  console.log("ola mundo");
  response.send("holaaaaa");
});

// Obtener todos los usuarios (original)
app.get("/users", async (_req, res) => {
  // Cambiado a /users para evitar conflicto con la raíz y ser más específico
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Error fetching all users:", error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

// Crear un nuevo usuario (original)
app.post("/users", async (req, res) => {
  // Cambiado a /users para ser más específico
  const {
    fullname,
    emailInput, // Cambiado de email a emailInput para evitar confusión con email de Supabase si se usa un alias
    identification,
    role,
    password_hash, // Se espera el password_hash en el body, pero se encriptará aquí
    birthdate,
    phone,
    sexo,
  } = req.body;

  const { data: existingUser, error: errorEmail } = await supabase
    .from("users")
    .select("email")
    .eq("email", emailInput);

  if (errorEmail) {
    console.error("Error checking existing user email:", errorEmail.message);
    return res.status(500).json({ message: "error al verificar correo" });
  }
  if (existingUser && existingUser.length !== 0) {
    return res.status(400).json({ message: "el usuario ya esta registrado" });
  }

  // Encriptar la contraseña antes de insertarla
  const hashPassword = await bcrypt.hash(password_hash, 10);
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        fullname,
        email: emailInput,
        identification,
        role,
        password_hash: hashPassword, // Guardar el hash
        birthdate,
        phone,
        sexo,
      },
    ])
    .select();

  if (error) {
    console.error("Error inserting new user:", error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log("New user registered:", data);
  return res.status(201).json({ message: "Registro exitoso", user: data[0] });
});

// Actualizar un usuario por ID (original)
app.put("/users/:id", async (req, res) => {
  // Cambiado a /users/:id para ser más específico
  const { id } = req.params;
  const {
    fullname,
    email,
    identification,
    role,
    password_hash,
    birthdate,
    phone,
    sexo,
  } = req.body;
  const inputUpdate = {};
  if (fullname) inputUpdate.fullname = fullname;
  if (email) inputUpdate.email = email;
  if (identification) inputUpdate.identification = identification;
  if (role) inputUpdate.role = role;
  if (birthdate) inputUpdate.birthdate = birthdate;
  if (phone) inputUpdate.phone = phone;
  if (sexo) inputUpdate.sexo = sexo;

  // Si se proporciona una nueva contraseña, encriptarla
  if (password_hash) {
    inputUpdate.password_hash = await bcrypt.hash(password_hash, 10);
  }

  const { data, error } = await supabase
    .from("users")
    .update(inputUpdate)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating user ${id}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log("User updated:", data);
  return res.json(data[0]); // Retornar el usuario actualizado
});

// Eliminar un usuario por ID (original)
app.delete("/users/:id", async (req, res) => {
  // Cambiado a /users/:id para ser más específico
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error deleting user ${id}:`, error.message);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "usuario no encontrado" });
  }

  return res.json({ message: "usuario eliminado", data: data[0] });
});

// Endpoint para obtener los detalles de un usuario por su ID (para dashboard)
app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: userDetails, error } = await supabase
      .from("users")
      .select(
        "id, fullname, email, identification, role, birthdate, phone, sexo"
      )
      .eq("id", userId)
      .single();

    if (error || !userDetails) {
      console.error(
        "Error fetching user details (for dashboard):",
        error?.message
      );
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    console.error(
      "Error al obtener detalles del usuario (for dashboard):",
      error.message
    );
    res.status(500).json({
      message: "Error interno del servidor al obtener detalles del usuario.",
    });
  }
});

// --- Endpoints de ROLES (Doctors y Patients) ---

// Crear un doctor (original)
app.post("/doctors", async (req, res) => {
  const { user_id, years_expirence } = req.body;
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    .select("id")
    .eq("id", user_id)
    .single();

  if (errorUsers || !users) {
    console.error("Error finding user for new doctor:", errorUsers?.message);
    return res.status(404).json({ error: "usuario no encontrado" });
  }

  const { data, error } = await supabase
    .from("doctors")
    .insert([{ user_id, years_expirence }])
    .select();

  if (error) {
    console.error("Error inserting new doctor:", error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data[0]);
});

// Crear un paciente (original)
app.post("/patiens", async (req, res) => {
  const { user_id } = req.body;
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    .select("id") // Necesitamos seleccionar 'id' para que `users` no sea nulo si no hay otros campos
    .eq("id", user_id)
    .single();

  if (errorUsers || !users) {
    console.error("Error finding user for new patient:", errorUsers?.message);
    return res.status(404).json({ error: "usuario no encontrado" }); // Cambiado de "paciente no encontrado" a "usuario no encontrado"
  }

  const { data, error } = await supabase
    .from("patiens")
    .insert([{ user_id }])
    .select();

  if (error) {
    console.error("Error inserting new patient:", error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data[0]);
});

// Endpoint para obtener el patient_id de un usuario (para dashboard)
app.get("/patients/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: patient, error } = await supabase
      .from("patiens")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (error || !patient) {
      console.error("Error fetching patient ID:", error?.message);
      return res
        .status(404)
        .json({ message: "Paciente no encontrado para este usuario." });
    }
    res.status(200).json(patient); // Retorna { id: patient_id }
  } catch (error) {
    console.error("Error al obtener patient_id:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

// Endpoint para obtener el doctor_id de un usuario (para dashboard)
app.get("/doctors/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: doctor, error } = await supabase
      .from("doctors")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (error || !doctor) {
      console.error("Error fetching doctor ID:", error?.message);
      return res
        .status(404)
        .json({ message: "Doctor no encontrado para este usuario." });
    }
    res.status(200).json(doctor); // Retorna { id: doctor_id }
  } catch (error) {
    console.error("Error al obtener doctor_id:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

// --- Endpoints de CITAS (Appointments) ---

// Obtener todas las citas con detalles de paciente (original)
app.get("/appointments", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("appointments").select(`
                id,
                appointment_date,
                reason,
                patiens (
                    id,
                    users (
                        id,
                        fullname,
                        email,
                        birthdate
                    )
                ),
                doctors ( users (fullname) ),
                status (name)
            `);

    if (error) {
      console.error("Error fetching all appointments:", error.message);
      return res.status(500).json({ error: error.message });
    }

    // Aplanar la estructura para facilitar el consumo en el frontend
    const formattedAppointments = data.map((app) => ({
      id: app.id,
      appointment_date: app.appointment_date,
      reason: app.reason,
      patient_id: app.patiens?.id,
      patient_fullname: app.patiens?.users?.fullname,
      patient_email: app.patiens?.users?.email,
      patient_birthdate: app.patiens?.users?.birthdate,
      doctor_fullname: app.doctors?.users?.fullname,
      status_name: app.status?.name,
    }));

    return res.json(formattedAppointments);
  } catch (err) {
    console.error("Error in /appointments endpoint:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Obtener citas de un paciente por ID (original - simplificado, usaremos el endpoint del dashboard para más detalles)
app.get("/appointments/patient/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", id);

  if (error) {
    console.error(
      `Error fetching appointments for patient ${id}:`,
      error.message
    );
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res
      .status(404)
      .json({ error: "No se encontraron citas para este paciente" });
  }

  return res.json(data);
});

// Crear una nueva cita (original)
app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_date, status_id, reason, notes } =
    req.body;

  // Verificar si el paciente existe
  const { data: patientData, error: errorPatient } = await supabase
    .from("patiens")
    .select("id")
    .eq("id", patient_id)
    .single();

  if (errorPatient || !patientData) {
    console.error(
      "Error finding patient for new appointment:",
      errorPatient?.message
    );
    return res.status(404).json({ error: "paciente no encontrado" });
  }

  // Opcional: Verificar si el doctor existe (no estaba en tu original, pero es buena práctica)
  const { data: doctorData, error: errorDoctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("id", doctor_id)
    .single();

  if (errorDoctor || !doctorData) {
    console.error(
      "Error finding doctor for new appointment:",
      errorDoctor?.message
    );
    return res.status(404).json({ error: "doctor no encontrado" });
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert([
      { patient_id, doctor_id, appointment_date, status_id, reason, notes },
    ])
    .select();

  if (error) {
    console.error("Error inserting new appointment:", error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data[0]);
});

// Actualizar una cita (parcialmente) por ID (original)
app.patch("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { reason, status_id, notes, appointment_date, doctor_id } = req.body; // Añadir más campos para actualizar

  const inputUpdate = {};
  if (reason !== undefined) inputUpdate.reason = reason;
  if (status_id !== undefined) inputUpdate.status_id = status_id;
  if (notes !== undefined) inputUpdate.notes = notes;
  if (appointment_date !== undefined)
    inputUpdate.appointment_date = appointment_date;
  if (doctor_id !== undefined) inputUpdate.doctor_id = doctor_id;

  const { data: appointmentData, error: errorAppointment } = await supabase
    .from("appointments")
    .select("id")
    .eq("id", id)
    .single();

  if (errorAppointment || !appointmentData) {
    console.error(
      `Error finding appointment ${id} for update:`,
      errorAppointment?.message
    );
    return res.status(404).json({ error: "cita no encontrada" });
  }

  const { data, error } = await supabase
    .from("appointments")
    .update(inputUpdate)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Error updating appointment ${id}:`, error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data[0]); // Retorna el dato actualizado
});
app.get("/appointments/fecha", async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  if (!date) {
    return res
      .status(400)
      .json({ error: "Debe enviar la fecha en query ?date=YYYY-MM-DD" });
  }

  // Definimos el rango de ese día
  const startDate = `${date}T00:00:00`;
  const endDate = `${date}T23:59:59`;

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      reason,
      appointment_date,
      patiens (
        id,
        users (
          fullname,
          birthdate
        )
      )
    `
    )
    .gte("appointment_date", startDate) // mayor o igual al inicio del día
    .lte("appointment_date", endDate); // menor o igual al final del día

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(200).json({
      message: "No hay citas registradas para este día",
      citas: [],
    });
  }
  res.json(data);
});

// Endpoint para obtener citas de un paciente para un mes y año específicos (para dashboard)
app.get(
  "/appointments/patient/:patientId/month/:year/:month",
  async (req, res) => {
    try {
      const { patientId, year, month } = req.params;

      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString(); // Fin del último día del mes

      const { data: appointments, error } = await supabase
        .from("appointments")
        .select(
          `
                id,
                patient_id,
                doctor_id,
                appointment_date,
                status_id,
                reason,
                notes,
                status ( name ),
                doctors ( users ( fullname ) ),
                patiens ( users ( fullname ) )
            `
        )
        .eq("patient_id", patientId)
        .gte("appointment_date", startDate)
        .lte("appointment_date", endDate)
        .order("appointment_date", { ascending: true });

      if (error) {
        console.error(
          "Error fetching patient appointments for month:",
          error.message
        );
        return res.status(500).json({
          message: "Error interno del servidor al obtener citas de paciente.",
        });
      }

      // Aplanamos la estructura de la respuesta para que sea más fácil de consumir en el frontend
      const formattedAppointments = appointments.map((app) => ({
        id: app.id,
        patient_id: app.patient_id,
        doctor_id: app.doctor_id,
        appointment_date: app.appointment_date,
        status_id: app.status_id,
        reason: app.reason,
        notes: app.notes,
        status_name: app.status?.name, // Acceso seguro
        doctor_name: app.doctors?.users?.fullname, // Acceso seguro
        patient_name: app.patiens?.users?.fullname, // Acceso seguro
      }));

      res.status(200).json(formattedAppointments);
    } catch (error) {
      console.error(
        "Error al obtener citas de paciente mensuales:",
        error.message
      );
      res.status(500).json({
        message: "Error interno del servidor al obtener citas de paciente.",
      });
    }
  }
);

// Endpoint para obtener citas de un doctor para un mes y año específicos (para dashboard)
app.get(
  "/appointments/doctor/:doctorId/month/:year/:month",
  async (req, res) => {
    try {
      const { doctorId, year, month } = req.params;

      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString(); // Fin del último día del mes

      const { data: appointments, error } = await supabase
        .from("appointments")
        .select(
          `
                id,
                patient_id,
                doctor_id,
                appointment_date,
                status_id,
                reason,
                notes,
                status ( name ),
                doctors ( users ( fullname ) ),
                patiens ( users ( fullname ) )
            `
        )
        .eq("doctor_id", doctorId)
        .gte("appointment_date", startDate)
        .lte("appointment_date", endDate)
        .order("appointment_date", { ascending: true });

      if (error) {
        console.error(
          "Error fetching doctor appointments for month:",
          error.message
        );
        return res.status(500).json({
          message: "Error interno del servidor al obtener citas de doctor.",
        });
      }

      // Aplanamos la estructura de la respuesta para que sea más fácil de consumir en el frontend
      const formattedAppointments = appointments.map((app) => ({
        id: app.id,
        patient_id: app.patient_id,
        doctor_id: app.doctor_id,
        appointment_date: app.appointment_date,
        status_id: app.status_id,
        reason: app.reason,
        notes: app.notes,
        status_name: app.status?.name, // Acceso seguro
        doctor_name: app.doctors?.users?.fullname, // Acceso seguro
        patient_name: app.patiens?.users?.fullname, // Acceso seguro
      }));

      res.status(200).json(formattedAppointments);
    } catch (error) {
      console.error(
        "Error al obtener citas de doctor mensuales:",
        error.message
      );
      res.status(500).json({
        message: "Error interno del servidor al obtener citas de doctor.",
      });
    }
  }
);

// Login de autenticación para abrir el dashboard (original)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, fullname, password_hash, role")
    .eq("email", email)
    .single();

  if (error || !users) {
    console.error(
      "Login error (user not found in DB):",
      error?.message || "User not found"
    );
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  const match = await bcrypt.compare(password, users.password_hash);

  if (!match) {
    return res.status(401).json({ error: "Usuario o contraseña inválidos" });
  }
  const userSafe = {
    id: users.id,
    email: users.email,
    fullname: users.fullname,
    role: users.role,
  };

  res.json({ message: "Login correcto", users: userSafe });
});

// Buscar todas las citas de un paciente con detalles (original - pero modificado para ser más completo para el dashboard)
app.get("/patients/appointments/:id", async (req, res) => {
  const id = req.params.id; // Este 'id' es el patient_id

  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
            id,
            appointment_date,
            reason,
            status ( name ),
            doctors ( users ( fullname ) ),
            patiens ( users ( id, fullname, email, birthdate, role ) )
            `
    )
    .eq("patient_id", id); // Usamos patient_id aquí

  if (appointmentsError) {
    console.error(
      `Error fetching patient ${id} appointments:`,
      appointmentsError.message
    );
    return res.status(400).json({ error: appointmentsError.message });
  }

  if (!appointments || appointments.length === 0) {
    return res
      .status(404)
      .json({ error: "No se encontraron citas para este paciente" });
  }

  // Aplanar la estructura para facilitar el consumo en el frontend
  const formattedAppointments = appointments.map((app) => ({
    id: app.id,
    appointment_date: app.appointment_date,
    reason: app.reason,
    status_name: app.status?.name,
    doctor_name: app.doctors?.users?.fullname,
    patient_id: app.patiens?.id,
    patient_fullname: app.patiens?.users?.fullname,
    patient_email: app.patiens?.users?.email,
    patient_birthdate: app.patiens?.users?.birthdate,
    patient_role: app.patiens?.users?.role,
  }));

  res.json(formattedAppointments);
});

// Obtener citas por fecha específica (original)
app.get("/appointments/fecha", async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  if (!date) {
    return res
      .status(400)
      .json({ error: "Debe enviar la fecha en query ?date=YYYY-MM-DD" });
  }

  // Definimos el rango de ese día
  const startDate = `${date}T00:00:00.000Z`; // Asegúrate de que el formato ISO sea correcto para Supabase
  const endDate = `${date}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
            id,
            reason,
            appointment_date,
            patiens (
                id,
                users (
                    fullname,
                    birthdate
                )
            ),
            doctors ( users ( fullname ) ),
            status ( name )
        `
    )
    .gte("appointment_date", startDate)
    .lte("appointment_date", endDate)
    .order("appointment_date", { ascending: true }); // Añadido para consistencia

  if (error) {
    console.error("Error fetching appointments by date:", error.message);
    return res.status(500).json({ error: error.message });
  }

  // Aplanar la estructura de la respuesta
  const formattedAppointments = data.map((app) => ({
    id: app.id,
    reason: app.reason,
    appointment_date: app.appointment_date,
    patient_id: app.patiens?.id,
    patient_fullname: app.patiens?.users?.fullname,
    patient_birthdate: app.patiens?.users?.birthdate,
    doctor_fullname: app.doctors?.users?.fullname,
    status_name: app.status?.name,
  }));

  res.json(formattedAppointments);
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor arriba en puerto http://localhost:3000");
});
