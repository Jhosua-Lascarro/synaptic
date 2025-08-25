// server.js

// Imports Modules
import cors from 'cors';
import express from 'express';
import { supabase, supabaseData } from './supabase/api.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/users', async (_req, res) => { // endPoint
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// Show URL
app.listen(supabaseData.port, () => {
    console.log(`endPoint: http://localhost:${supabaseData.port}/Users`);
});
