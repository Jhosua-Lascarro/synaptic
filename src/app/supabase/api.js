// supabase.js

import { createClient } from '@supabase/supabase-js'
import "dotenv/config";

export const supabaseData = {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    port: process.env.SUPABASE_PORT || 3000
};

export const supabase = createClient(supabaseData.url, supabaseData.key);
