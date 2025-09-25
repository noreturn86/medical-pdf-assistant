import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { createWorker } from "tesseract.js";
import { fromPath } from "pdf2pic";

dotenv.config({ path: path.resolve('../.env') });

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
app.post('/api/summarize', async (req, res) => {
  try{
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Document text missing" });
    }

    const prompt = `Summarize the following medical text in a few sentences, focused on getting the most important 
                    point(s) across to an average patient, and ending with a statement about whether or not there is anything worrisome found: ${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});


app.post('/api/extractOcr', async (req, res) => {
  try {
    const { pdfUrl } = req.body;

    if (!pdfUrl) {
      return res.status(400).json({ error: "No pdf url received" });
    }

    const converter = fromPath(pdfUrl, {
      density: 300, // DPI (higher = better OCR accuracy, slower)
      saveFilename: "page",
      savePath: "./images",
      format: "png",
      width: 1654,   // A4 width
      height: 2339   // A4 height
    });

    const worker = await createWorker("eng");
    let fullText = "";
    let page = 1;

    while (true) {
      try {
        const pageImage = await converter(page);
        console.log(`📄 Processing page ${page}...`);

        const {
          data: { text },
        } = await worker.recognize(pageImage.path);

        fullText += `\n\n--- Page ${page} ---\n${text}`;
        page++;
      } catch (err) {
        // Stop when there are no more pages
        break;
      }
    }

    await worker.terminate();

    res.json({fullText: fullText});

  } catch {
    console.error("OCR error:", err);
    res.status(500).json({ error: "OCR failed to extract text" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));