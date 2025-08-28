import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

import { supabase } from "./conection_db.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

app.post("/", async (req, res) => {
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

  const {data:existingUser,error:errorEmail} = await  supabase
  .from('users')
   .select('email')
  .eq('email',emailInput)
 

  if (errorEmail) {
    return res.status(500).json({ message:"error al verificar correo"  });
  }
  if (existingUser.length!==0) {
    return res.status(400).json({  message:"el usuario ya esta registrado"  });
  }


  const hashPassword = await bcrypt.hash(password_hash,10);
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        fullname,
        email: emailInput,
        identification,
        role,
        password_hash:hashPassword,
        birthdate,
        phone,
        sexo,
      },
    ])
    .select();



  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.log(data);

  return res.status(201).json({message:"Registro exitoso"});
});

app.put("/:id", async (req, res) => {
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
  if (password_hash) inputUpdate.password_hash = password_hash;
  if (birthdate) inputUpdate.birthdate = birthdate;
  if (phone) inputUpdate.phone = phone;
  if (sexo) inputUpdate.sexo = sexo;

  const { data, error } = await supabase
    .from("users")
    .update(inputUpdate)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  console.log(data);
  return res.json(data);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "usuario no encontrado" });
  }

  return res.json({ message: "usuario eliminado", data });
});

app.post("/doctors", async (req, res) => {
  const { user_id, years_expirence } = req.body;
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    .select("id")
    .eq("id", user_id)
    .single();

  if (errorUsers || !users) {
    return res.status(404).json({ error: "usuario no encontrado" });
  }

  const { data, error } = await supabase
    .from("doctors")
    .insert([{ user_id, years_expirence }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

app.post("/patiens", async (req, res) => {
  const { user_id } = req.body;
  const { data: users, error: errorUsers } = await supabase
    .from("users")
    
    .eq("id", user_id)
    .single();

  if (errorUsers || !users) {
    return res.status(404).json({ error: "paciente no encontrado" });
  }

  const { data, error } = await supabase
    .from("patiens")
    .insert([{ user_id }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

app.get("/appointments", async (_req, res) => {
  const { data, error } = await supabase.from("/appointments").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

app.get("/appointments/patient/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "No se encontraron citas para este paciente" });
  }

  return res.json(data);
});

app.post("/appointments", async (req, res) => {
  const { patient_id, doctor_id, appointment_date, status_id, reason, notes } =
    req.body;
  const { data: patients, error: errorpatients } = await supabase
    .from("patiens")
    .select("id")
    .eq("id", patient_id)
    .single();

  if (errorpatients || !patients) {
    return res.status(404).json({ error: "paciente no encontrado" });
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert([
      { patient_id, doctor_id, appointment_date, status_id, reason, notes },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

app.patch("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const { data: patients, error: errorpatients } = await supabase
    .from("appointments")
    .select("id")
    .eq("id", id)
    .single();

  if (errorpatients || !patients) {
    return res.status(404).json({ error: "cita no encontrado" });
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ reason })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

/*este es el login d la autenticacion para abrir el dashboard */

  app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario
  const { data: users, error } = await supabase
    .from("users")
    .select("id, email, password_hash, role")
    .eq("email", email)
    .single();

  if (error || !users) {
    return res.status(401).json({ error: "Usuario no encontrado" });
  }

  // Validar contraseña (esto es plano, lo ideal es bcrypt)
  if (users.password_hash !== password) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  

  res.json({ message: "Login correcto", users });
  })


/* buscar todas las citas de un paciente */

app.get("/patients/appointments/:id", async (req, res) => {
  const id = req.params.id;

  const { data: patient, error: patientError } = await supabase
    .from("patiens")
    .select(`
      id,
      user:users(id,fullname, email,role),
      appointments(id, appointment_date, reason)
    `)
    .eq("id", id);

  if (patientError) {
    return res.status(400).json({ error: patientError.message });
  }

  if (!patient || patient.length === 0) {
    return res.status(404).json({ error: "Patient not found" });
  }

  res.json(patient[0]);
});


app.listen(3000, (error) => {
  if (error) {
    console.error("error en el servidor", error.message);
  }
  console.log("servidor arriba en puerto http://localhost:3000");
});
