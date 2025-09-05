import bcrypt from "bcrypt";
import cors from "cors";
import express from "express";
import { supabase } from "./conection_db.js";

const app = express();

app.use(express.json());
app.use(cors());

// --- USER Endpoints (Basic CRUD and Authentication) --

// Get all users
app.get("/users", async (_req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Error fetching all users:", error.message);
    return res.status(500).json({ error: error.message });
  }
  return res.json(data);
});

// Create a new user
app.post("/users", async (req, res) => {
  const {
    fullname,
    emailInput,
    identification,
    role,
    password_hash,
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
    return res.status(500).json({ message: "error verifying email" });
  }
  if (existingUser && existingUser.length !== 0) {
    return res.status(400).json({ message: "user already registered" });
  }

  // Encrypt the password before inserting
  const hashPassword = await bcrypt.hash(password_hash, 10);
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        fullname,
        email: emailInput,
        identification,
        role,
        password_hash: hashPassword,
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
  return res.status(201).json({ message: "Registration successful", user: data[0] });
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
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

  // If a new password is provided, encrypt it
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
  return res.json(data[0]);
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
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
    return res.status(404).json({ message: "user not found" });
  }

  return res.json({ message: "user deleted", data: data[0] });
});

// Get user details by ID (for dashboard)
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
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    console.error(
      "Error getting user details (for dashboard):",
      error.message
    );
    res.status(500).json({
      message: "Internal server error getting user details.",
    });
  }
});

// --- ROLE Endpoints (Doctors and Patients) ---

// Create a doctor
app.post("/doctors", async (req, res) => {
  const { user_id, years_expirence } = req.body;
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    .select("id")
    .eq("id", user_id)
    .single();

  if (errorUsers || !users) {
    console.error("Error finding user for new doctor:", errorUsers?.message);
    return res.status(404).json({ error: "user not found" });
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

// Create a patient
app.post("/patiens", async (req, res) => {
  const { user_id } = req.body;
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    .select("id")
    .eq("id", user_id)
    .single();

  if (errorUsers || !users) {
    console.error("Error finding user for new patient:", errorUsers?.message);
    return res.status(404).json({ error: "user not found" });
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

// Get patient_id of a user (for dashboard)
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
        .json({ message: "Patient not found for this user." });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error getting patient_id:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get doctor_id of a user (for dashboard)
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
        .json({ message: "Doctor not found for this user." });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error getting doctor_id:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// --- APPOINTMENT Endpoints ---

// Get all appointments with patient details
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

    // Flatten the structure for easier frontend consumption
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

// Get appointments for a patient by ID
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
      .json({ error: "No appointments found for this patient" });
  }

  return res.json(data);
});

// Create a new appointment
app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_date, status_id, reason, notes } =
    req.body;

  // Verificar paciente
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
    return res.status(404).json({ error: "patient not found" });
  }

  // Verificar doctor
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
    return res.status(404).json({ error: "doctor not found" });
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

// Partially update an appointment by ID
app.patch("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { reason, status_id, notes, appointment_date, doctor_id } = req.body;

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
    return res.status(404).json({ error: "appointment not found" });
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
  return res.status(200).json(data[0]);
});

// Get appointments by date in doctor view
app.get("/appointments/fecha", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ error: "Must send date in query ?date=YYYY-MM-DD" });
  }

  // Define the range for that day
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
    .gte("appointment_date", startDate)
    .lte("appointment_date", endDate);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) {
    return res.status(200).json({
      citas: [],
    });
  }
  res.json(data);
});

// Get patient appointments for a specific month and year (for dashboard)
app.get("/appointments/patient/:patientId/month/:year/:month", async (req, res) => {
  try {
    const { patientId, year, month } = req.params;

    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

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
        message: "Internal server error getting patient appointments.",
      });
    }

    // Flatten the response structure for easier frontend consumption
    const formattedAppointments = appointments.map((app) => ({
      id: app.id,
      patient_id: app.patient_id,
      doctor_id: app.doctor_id,
      appointment_date: app.appointment_date,
      status_id: app.status_id,
      reason: app.reason,
      notes: app.notes,
      status_name: app.status?.name,
      doctor_name: app.doctors?.users?.fullname,
      patient_name: app.patiens?.users?.fullname,
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error(
      "Error getting monthly patient appointments:",
      error.message
    );
    res.status(500).json({
      message: "Internal server error getting patient appointments.",
    });
  }
}
);

// Get doctor appointments for a specific month and year (for dashboard)
app.get("/appointments/doctor/:doctorId/month/:year/:month", async (req, res) => {
  try {
    const { doctorId, year, month } = req.params;

    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

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
        message: "Internal server error getting doctor appointments.",
      });
    }

    // Flatten the response structure for easier frontend consumption
    const formattedAppointments = appointments.map((app) => ({
      id: app.id,
      patient_id: app.patient_id,
      doctor_id: app.doctor_id,
      appointment_date: app.appointment_date,
      status_id: app.status_id,
      reason: app.reason,
      notes: app.notes,
      status_name: app.status?.name,
      doctor_name: app.doctors?.users?.fullname,
      patient_name: app.patiens?.users?.fullname,
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error(
      "Error getting monthly doctor appointments:",
      error.message
    );
    res.status(500).json({
      message: "Internal server error getting doctor appointments.",
    });
  }
}
);

// Authentication login to open dashboard
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, fullname, password_hash, role, identification")
    .eq("email", email)
    .single();

  if (error || !users) {
    console.error(
      "Login error (user not found in DB):",
      error?.message || "User not found"
    );
    return res.status(401).json({ error: "User not found" });
  }

  const match = await bcrypt.compare(password, users.password_hash);

  if (!match) {
    return res.status(401).json({ error: "Invalid user or password" });
  }

  const userSafe = {
    id: users.id,
    email: users.email,
    fullname: users.fullname,
    role: users.role,
    identification: users.identification,
  };

  res.json({ message: "Login successful", users: userSafe });
});

// Find all appointments for a patient with details
app.get("/patients/appointments/:id", async (req, res) => {
  const id = req.params.id;

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
    .eq("patient_id", id);

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
      .json({ error: "No appointments found for this patient" });
  }

  // Flatten the structure for easier frontend consumption
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

// Get appointments by specific date
app.get("/appointments/fecha", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ error: "Must send date in query ?date=YYYY-MM-DD" });
  }

  // Define the range for that day
  const startDate = `${date}T00:00:00.000Z`;
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
    .order("appointment_date", { ascending: true });

  if (error) {
    console.error("Error fetching appointments by date:", error.message);
    return res.status(500).json({ error: error.message });
  }

  // Flatten the response structure
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

// GET doctors with fullname and specialties
app.get("/doctors/summary", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select(`
        id,
        user_id,
        years_expirence,
        users:users!doctors_user_id_fkey (
          fullname,
          email,
          phone
        ),
        doctor_specialties (
          specialties (
            id,
            name
          )
        )
      `);

    if (error) {
      console.error("Error fetching doctors summary:", error.message);
      return res.status(500).json({ error: error.message });
    }

    const mapped = (data || []).map((d) => {
      const specialties =
        (d.doctor_specialties || [])
          .map((ds) => ds.specialties?.name)
          .filter(Boolean);

      return {
        id: d.id,
        fullname: d.users?.fullname || "Sin nombre",
        email: d.users?.email || null,
        phone: d.users?.phone || null,
        years_expirence: d.years_expirence || 0,
        specialties, // Name arrays
        primary_specialty: specialties?.[0] || null,
      };
    });

    return res.json(mapped);
  } catch (err) {
    console.error("Unexpected error on /doctors/summary:", err);
    return res.status(500).json({ error: "Unexpected error" });
  }
});
app.get("/", (req, res) => {
  res.json({ message: "Servidor preparado" });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

 
  console.log("Servidor arriba en puerto http://localhost:3000");

});
