// // supabase.js

// import { createClient } from "@supabase/supabase-js";
// import "dotenv/config";
// import express from "express";

// const supabaseData = {
//   url: process.env.SUPABASE_URL,
//   key: process.env.SUPABASE_KEY,
//   port: process.env.PORT || 3000,
// };

// const supabase = createClient(supabaseData.url, supabaseData.key);


// const app = express();
// app.get("/Users", async (req, res) => {
//   // endPoint
//   const { data, error } = await supabase.from("Users").select("*");
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   res.json(data);
// });

// // Show URL
// app.listen(supabaseData.port, () => {
//   console.log(`endPoint: http://localhost:${supabaseData.port}/Users`);
// });
// console.log(supabase.port);