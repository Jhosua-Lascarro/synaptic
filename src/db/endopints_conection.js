import cors from "cors";
import express from "express";
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
    email,
    identification,
    role,
    password_hash,
    birthdate,
    phone,
    sexo,
  } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        fullname,
        email,
        identification,
        role,
        password_hash,
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

  return res.status(201).json(data);
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

app.listen(3000, (error) => {
  if (error) {
    console.error("error en el servidor", error.message);
  }
  console.log("servidor arriba en puerto http://localhost:3000");
});
