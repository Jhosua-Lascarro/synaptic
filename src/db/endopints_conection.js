import cors from "cors";
import express from "express";
import { supabase, supabaseData } from "./conection_db.js";

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- ROUTERS ----------------
app.get("/patients", async (req, res) => {
  const { data, error } = await supabase.from("patients").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, username, role, identification } = req.body;

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const auth_id = data.user.id; 

    const { error: dbError } = await supabase.from("users").insert([
      {
        auth_id,
        username,
        email,
        role,
        identification,
      },
    ]);

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ username, password });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ---------------- SERVER ----------------
app.listen(supabaseData.port, () => {
  console.log(`✅ Server running at: http://localhost:${supabaseData.port}`);
});
