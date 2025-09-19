# Full-Stack Notes App

A modern notes application built with the MERN stack featuring AI-powered note summarization using Google's Gemini API.

## Features

- ✅ Create, read, and delete notes
- 🤖 AI-powered note summarization with Google Gemini
- 📱 Responsive design
- ☁️ Cloud deployment ready (Vercel)
- 🗄️ MongoDB database storage

## Tech Stack

**Frontend:**
- React.js
- Axios for API calls
- CSS for styling

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Generative AI (Gemini)
- CORS enabled

## Prerequisites

- Node.js (v18+)
- MongoDB database (local or cloud)
- Google AI API key for Gemini

## Installation & Setup

### Backend Setup

1. Clone and navigate to backend directory
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install express mongoose cors dotenv @google/generative-ai
```

3. Create `.env` file in backend root:
```env
MONGO_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_api_key
```

4. Create `vercel.json` for deployment:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "./app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ]
}
```

5. Run backend locally
```bash
node app.js
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install react axios
```

3. Create `.env` file in frontend root:
```env
REACT_APP_VERCEL_KEY=your_deployed_backend_url
```

4. Create `vercel.json` for deployment:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.vercel.app/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

5. Run frontend locally
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create new note |
| DELETE | `/api/notes/:id` | Delete note by ID |
| POST | `/api/notes/:id/summarize` | Generate AI summary |

## Deployment

### Backend (Vercel)

1. Deploy to Vercel
```bash
vercel --prod
```

2. Set environment variables in Vercel dashboard:
   - `MONGO_URL`
   - `GEMINI_API_KEY`

### Frontend (Vercel)

1. Update `.env` with deployed backend URL
2. Deploy to Vercel
```bash
vercel --prod
```

## Project Structure

```
notes-app/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── vercel.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── notesApi.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── package.json
    ├── vercel.json
    └── .env
```

## How It Works

1. **Notes CRUD**: Users can create notes with title and content, view all notes, and delete unwanted notes
2. **AI Summarization**: Click "Summarize" on any note to get an AI-generated summary using Google Gemini
3. **Data Storage**: All notes are stored in MongoDB with automatic timestamps
4. **Error Handling**: Robust error handling for failed API calls and edge cases
5. **Responsive UI**: Clean, simple interface that works on all devices

## Environment Variables

**Backend:**
- `MONGO_URL`: MongoDB connection string
- `GEMINI_API_KEY`: Google AI API key

**Frontend:**
- `REACT_APP_VERCEL_KEY`: Backend deployment URL

## Troubleshooting

- **405 Method Not Allowed**: Check backend routes are properly configured
- **CORS errors**: Ensure CORS is enabled in backend
- **Database connection**: Verify MongoDB URL and network access
- **AI summarization fails**: Check Gemini API key and quota

## License

MIT License
