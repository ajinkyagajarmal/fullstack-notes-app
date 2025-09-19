// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/notes';

// export const getNotes = async () => (await axios.get(API_URL)).data;
// export const createNote = async (note) => (await axios.post(API_URL, note)).data;
// export const deleteNote = async (id) => (await axios.delete(`${API_URL}/${id}`)).data;


import axios from "axios";

const API_URL = `${process.env.REACT_APP_VERCEL_KEY || "https://fullstack-notes-app-n82j.vercel.app"}/api/notes`;

export const getNotes = async () => (await axios.get(API_URL)).data;
export const createNote = async (note) => (await axios.post(API_URL, note)).data;
export const deleteNote = async (id) => (await axios.delete(`${API_URL}/${id}`)).data;
export const summarizeNote = async (id) =>
  (await axios.post(`${API_URL}/${id}/summarize`)).data;
