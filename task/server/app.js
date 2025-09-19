// // app.js
// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 5000;
// const NOTES_FILE = path.join(__dirname, 'notes.json');

// app.use(express.json());

// // Ensure notes.json exists
// if (!fs.existsSync(NOTES_FILE)) {
//   fs.writeFileSync(NOTES_FILE, JSON.stringify([]));
// }

// // Helper to read notes
// const readNotes = () => {
//   const data = fs.readFileSync(NOTES_FILE, 'utf-8');
//   return JSON.parse(data);
// };

// // Helper to write notes
// const writeNotes = (notes) => {
//   fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
// };

// // POST /notes - Create a new note
// app.post('/notes', (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content) {
//     return res.status(400).json({ error: 'Title and content are required.' });
//   }

//   const notes = readNotes();

//   const newNote = {
//     id: Date.now().toString(),
//     title,
//     content,
//     createdAt: new Date().toISOString()
//   };

//   notes.push(newNote);
//   writeNotes(notes);

//   res.status(201).json(newNote);
// });

// // GET /notes - Retrieve all notes
// app.get('/notes', (req, res) => {
//   const notes = readNotes();
//   res.json(notes);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Note Schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'notesData' }); // explicitly set collection name

const Note = mongoose.model('Note', noteSchema);

// // OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // store in .env
// });

// CREATE a new note
app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save note.' });
  }
});

// READ all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// DELETE a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note.' });
  }
});

// Summarize note using ChatGPT

// app.post("/api/notes/:id/summarize", async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     if (!note) return res.status(404).json({ error: "Note not found" });

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are an assistant that summarizes notes clearly and concisely." },
//         { role: "user", content: `Summarize this note:\n\n${note.content}` },
//       ],
//       max_tokens: 100,
//     });

//     const summary = response.choices[0].message.content;
//     res.json({ summary });
//   } catch (err) {
//     console.error("Error summarizing note:", err);

//     // fallback: return first 20 words as "summary"
//     if (err.code === "insufficient_quota") {
//       const note = await Note.findById(req.params.id);
//       const words = note.content.split(" ");
//       const short = words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");
//       return res.json({ summary: `⚠️ (Fallback) ${short}` });
//     }

//     res.status(500).json({ error: "Failed to summarize note" });
//   }
// });

// Summarize with Gemini
app.post("/api/notes/:id/summarize", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    console.log("Summarizing with Gemini:", note.content);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // free & fast
    const result = await model.generateContent(`Summarize this note:\n\n${note.content}`);

    const summary = result.response.text();
    res.json({ summary });
  } catch (err) {
    console.error("Gemini summarization error:", err);
    res.status(500).json({ error: "Failed to summarize with Gemini" });
  }
});



module.exports = app;
