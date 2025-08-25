import express from "express";
import cors from "cors";
import { supabase } from "./conection_db.js";



const app=express()

app.use(express.json())
app.use(cors())

app.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});




app.post("/",async (req,res) => {
  const {fullname,email,identification,role,password_hash,birthdate,phone,sexo} =req.body
  
})


app.listen(3000, (error) => {
  if (error) {
     console.error("error en el servidor",error.message)
    
  }
  console.log(`servidor arriba en puerto http://localhost:3000`)
 
  
})



