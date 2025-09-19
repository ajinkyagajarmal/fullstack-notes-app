// import React, { useEffect, useState } from "react";
// import { getNotes, createNote, deleteNote, summarizeNote } from "./api/notesApi";
// import "./App.css";

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [form, setForm] = useState({ title: "", content: "" });
//   const [summaries, setSummaries] = useState({});

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     try {
//       const data = await getNotes();
//       setNotes(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Failed to fetch notes:", error);
//       setNotes([]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await createNote(form);
//     setForm({ title: "", content: "" });
//     fetchNotes();
//   };

//   const handleDelete = async (id) => {
//     await deleteNote(id);
//     fetchNotes();
//   };

//   const handleSummarize = async (id) => {
//     try {
//       const data = await summarizeNote(id);
//       setSummaries((prev) => ({ ...prev, [id]: data.summary }));
//     } catch (err) {
//       setSummaries((prev) => ({ ...prev, [id]: `⚠ ${err.message}` }));
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Notes App</h1>

//       <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           required
//         />
//         <textarea
//           placeholder="Content"
//           value={form.content}
//           onChange={(e) => setForm({ ...form, content: e.target.value })}
//           required
//         />
//         <button type="submit">Add Note</button>
//       </form>

//       <ul>
//         {Array.isArray(notes) && notes.length > 0 ? (
//           notes.map((note) => (
//             <li key={note._id} style={{ marginBottom: "15px" }}>
//               <h3>{note.title}</h3>
//               <p>{note.content}</p>
//               <button onClick={() => handleDelete(note._id)}>Delete</button>
//               <button
//                 onClick={() => handleSummarize(note._id)}
//                 style={{ marginLeft: "10px" }}
//               >
//                 Summarize
//               </button>
//               {summaries[note._id] && (
//                 <p style={{ fontStyle: "italic", marginTop: "5px" }}>
//                   <strong>Summary:</strong> {summaries[note._id]}
//                 </p>
//               )}
//             </li>
//           ))
//         ) : (
//           <p>No notes available.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote, summarizeNote } from "./api/notesApi";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [summaries, setSummaries] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setError("Failed to load notes. Please try again.");
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    
    setIsLoading(true);
    try {
      await createNote(form);
      setForm({ title: "", content: "" });
      await fetchNotes();
    } catch (error) {
      setError("Failed to create note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await deleteNote(id);
      await fetchNotes();
    } catch (error) {
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleSummarize = async (id) => {
    try {
      setSummaries((prev) => ({ ...prev, [id]: "Generating summary..." }));
      const data = await summarizeNote(id);
      setSummaries((prev) => ({ ...prev, [id]: data.summary }));
    } catch (err) {
      setSummaries((prev) => ({ ...prev, [id]: `⚠️ Failed to generate summary` }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 My Notes</h1>
        <p>Organize your thoughts with AI-powered insights</p>
      </header>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="close-btn">×</button>
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="note-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter note title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your note content here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              className="form-textarea"
              rows="4"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading || !form.title.trim() || !form.content.trim()}
          >
            {isLoading ? "Creating..." : "✨ Add Note"}
          </button>
        </form>
      </div>

      <div className="notes-container">
        {isLoading && notes.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your notes...</p>
          </div>
        ) : Array.isArray(notes) && notes.length > 0 ? (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note._id} className="note-card">
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <span className="note-date">{formatDate(note.createdAt)}</span>
                </div>
                
                <div className="note-content">
                  <p>{note.content}</p>
                </div>

                {summaries[note._id] && (
                  <div className="note-summary">
                    <div className="summary-header">
                      <span className="summary-icon">🤖</span>
                      <strong>AI Summary</strong>
                    </div>
                    <p className="summary-text">{summaries[note._id]}</p>
                  </div>
                )}

                <div className="note-actions">
                  <button
                    onClick={() => handleSummarize(note._id)}
                    className="btn btn-secondary"
                    disabled={summaries[note._id] === "Generating summary..."}
                  >
                    {summaries[note._id] === "Generating summary..." ? "🔄" : "🤖"} Summarize
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes yet</h3>
            <p>Create your first note to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
