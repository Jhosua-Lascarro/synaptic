import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export const supabaseData = {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  port: process.env.PORT || 3000,
};

export const supabase = createClient(supabaseData.url, supabaseData.key);

async function test_connection() {
    try {
        const { data, error } = await supabase.from("patients").select("*");
        if (error) {
            console.error('❌ Error al conectar con la base de datos:', error.message);
        } else {
            console.log('✅ Conexión a la base de datos exitosa');
        }
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
}
test_connection()
console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_KEY ? "OK" : "MISSING");
