import React, { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "./api/notesApi";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [summaries, setSummaries] = useState({}); // store summaries

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []); // Ensure it's always an array
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setNotes([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNote(form);
    setForm({ title: "", content: "" });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  const handleSummarize = async (id) => {
    try {
      const res = await fetch(`/api/notes/${id}/summarize`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize");
      }

      setSummaries((prev) => ({ ...prev, [id]: data.summary }));
    } catch (err) {
      setSummaries((prev) => ({ ...prev, [id]: `⚠ ${err.message}` }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <ul>
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note) => (
            <li key={note._id} style={{ marginBottom: "15px" }}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
              <button
                onClick={() => handleSummarize(note._id)}
                style={{ marginLeft: "10px" }}
              >
                Summarize
              </button>
              {summaries[note._id] && (
                <p style={{ fontStyle: "italic", marginTop: "5px" }}>
                  <strong>Summary:</strong> {summaries[note._id]}
                </p>
              )}
            </li>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
