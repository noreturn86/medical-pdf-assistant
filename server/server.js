import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    })
);

app.use(express.json());


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


//routes
app.post('/api/summarize', (req, res) => {
  
  const data = req.body;

  
  console.log(data);

  
  res.json({ message: 'Data received successfully', receivedData: data });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));