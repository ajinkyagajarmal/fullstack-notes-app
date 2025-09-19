// import React, { useEffect, useState } from "react";
// import { getNotes, createNote, deleteNote } from "./api/notesApi";
// import "./App.css";

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [form, setForm] = useState({ title: "", content: "" });

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const fetchNotes = async () => {
//     const data = await getNotes();
//     setNotes(data);
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
//         {notes.map((note) => (
//           <li key={note._id}>
//             <h3>{note.title}</h3>
//             <p>{note.content}</p>
//             <button onClick={() => handleDelete(note._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


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
    const data = await getNotes();
    setNotes(data);
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

  // const handleSummarize = async (id, content) => {
  //   try {
  //     const res = await fetch("http://localhost:5000/summarize", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ content }),
  //     });
  //     const data = await res.json();
  //     setSummaries((prev) => ({ ...prev, [id]: data.summary }));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

const handleSummarize = async (id) => {
  try {
    const res = await fetch(`/api/notes/${id}/summarize`, { method: "POST" });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to summarize");
    }

    setSummaries((prev) => ({ ...prev, [id]: data.summary }));
  } catch (err) {
    setSummaries((prev) => ({ ...prev, [id]: `⚠️ ${err.message}` }));
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
        {notes.map((note) => (
          <li key={note._id} style={{ marginBottom: "15px" }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleDelete(note._id)}>Delete</button>
            <button onClick={() => handleSummarize(note._id, note.content)} style={{ marginLeft: "10px" }}>
              Summarize
            </button>
            {summaries[note._id] && (
              <p style={{ fontStyle: "italic", marginTop: "5px" }}>
                <strong>Summary:</strong> {summaries[note._id]}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
