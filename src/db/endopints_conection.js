// supabase.js
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import express from "express";

const supabaseData = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  port: process.env.PORT || 3000,
};

const supabase = createClient(supabaseData.url, supabaseData.key);


const app = express();

app.use(express.json());
app.use(cors()); // hability for all routes
app.get("/Users", async (req, res) => {

  // endPoint for getting users
  const { data, error } = await supabase.from("Users").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.post("/auth/register", async (req, res) => {
  // endPoint for registering users
  const {username, email, password, role } = req.body;
  const { data, error } = await supabase.from("Users").insert([{ username, email, password, role }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.post("/auth/login", async (req, res) => {
  // endPoint for logging in users
  const {email, password} = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
    res.json(data);
});

// Show URL
app.listen(supabaseData.port, () => {
  console.log(`endPoint: http://localhost:${supabaseData.port}/Users`);
});