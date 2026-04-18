# FLASHMASTER – Setup Guide

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a MongoDB Atlas connection string

## 1. Backend (`/server`)

```bash
cd server
npm install
```

Copy environment file and edit if needed:

```bash
copy .env.example .env
```

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `PORT`         | API port (default `5000`)                        |
| `MONGODB_URI`  | e.g. `mongodb://127.0.0.1:27017/flashmaster`    |
| `JWT_SECRET`   | Long random string for signing tokens            |
| `CLIENT_URL`   | Frontend origin for CORS (e.g. `http://localhost:5173`) |

Start the API:

```bash
npm run dev
```

Or without file watcher: `npm start`

Uploaded files are stored under `server/uploads/` and served at `http://localhost:5000/uploads/...`.

## 2. Frontend (`/client`)

```bash
cd client
npm install
```

Optional: copy `.env.example` to `.env`. For local development you can leave `VITE_API_URL` empty so the Vite dev server proxies `/api` and `/uploads` to port 5000.

Start the app:

```bash
npm run dev
```

Open **http://localhost:5173**. Register a user, then use the dashboard.

## 3. Production build (client)

```bash
cd client
npm run build
npm run preview
```

Set `VITE_API_URL` to your deployed API base URL (no trailing slash) when building for production.

## Tech choices

- **UI:** React + **Tailwind CSS** (per stack preference). A separate Bootstrap build was not included to avoid conflicting design systems.

## API overview

| Prefix            | Purpose        |
|-------------------|----------------|
| `/api/auth`       | Register, login, `GET /me` |
| `/api/materials`  | CRUD materials + multipart upload |
| `/api/flashcards` | Generate, list, patch difficulty, delete |
| `/api/studyplans` | CRUD study plans |
| `/api/progress`   | Get / patch topic progress |

Flashcard text rules: **Q:** / **A:** paired lines, or **paragraphs** separated by a blank line (first line = question, rest = answer). For uploaded **`.txt`** materials, generation can read file content from the server disk.
