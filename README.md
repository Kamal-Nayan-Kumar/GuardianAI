# GuardianAI — Cyberbullying Detection & Protection System

> Real-time, AI-powered cyberbullying detection for chat platforms, with a
> dedicated parent / moderator dashboard for instant intervention.

GuardianAI is a full-stack chat application that wraps every conversation in a
transformer-based bullying-classification model. Messages are scored as they
flow through the chat, suspicious patterns are tracked across the last several
turns of a conversation, and alerts are pushed in real time to a guardian
dashboard so a human can review and act.

<p align="center">
  <img alt="React"      src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Vite"       src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="Node"       src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Express"    src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" />
  <img alt="MongoDB"    src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img alt="Socket.IO"  src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" />
  <img alt="FastAPI"    src="https://img.shields.io/badge/FastAPI-ML%20API-009688?logo=fastapi&logoColor=white" />
  <img alt="Tailwind"   src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" />
</p>

---

## Table of Contents

- [Highlights](#highlights)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Detection Model](#detection-model)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone](#1-clone)
  - [2. ML API (FastAPI)](#2-ml-api-fastapi)
  - [3. Backend (Node + Express + Socket.IO)](#3-backend-node--express--socketio)
  - [4. Frontend (React + Vite)](#4-frontend-react--vite)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Real-time Events](#real-time-events)
- [Dashboard Features](#dashboard-features)
- [Scripts](#scripts)
- [Security & Privacy](#security--privacy)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Highlights

- **Real-time threat detection** — every chat message is scored by a
  transformer model before it lands in the inbox.
- **Contextual analysis** — the model sees a rolling window of the last 10
  messages of the conversation, not just the latest line, so it can catch
  patterns that look harmless one message at a time.
- **Multi-category classification** — harassment, threats, sexual content,
  exclusion, cyberstalking, flaming, and generic abusive language.
- **Confidence & severity scoring** — every flag carries a 0–100 % confidence
  value and a `low / medium / high / critical` severity label.
- **Pattern-based alerting** — an alert fires after **3 consecutive
  high-confidence (> 85 %) messages**, not on a single false positive.
- **Guardian dashboard** — moderators can filter, review, resolve, or dismiss
  alerts with a single click.
- **Live notifications** — browser notifications + Socket.IO push to keep
  guardians in the loop without polling.
- **JWT auth with refresh tokens** — short-lived access tokens, HTTP-only
  refresh cookie, bcrypt password hashing.

## How It Works

```
   ┌────────────┐   chat   ┌──────────────┐   analyze   ┌─────────────┐
   │   React    │ ───────▶ │  Node API +  │ ──────────▶ │  FastAPI    │
   │  Frontend  │ ◀─────── │  Socket.IO   │ ◀────────── │  ML Engine  │
   └────────────┘  socket  └──────┬───────┘   score     └─────────────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │   MongoDB   │  ← users, messages, alerts
                           └─────────────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │  Guardian   │  ← live alert feed via socket
                           │  Dashboard  │
                           └─────────────┘
```

1. A user sends a message from the React client over Socket.IO.
2. The Node backend persists the message and forwards `(conversation_id, text)`
   to the FastAPI ML service.
3. The ML service appends the message to a rolling 10-message window for that
   conversation, runs the transformer, and returns
   `{is_bullying, confidence_score, alert_triggered, consecutive_high_scores}`.
4. If the score crosses the alert threshold, the backend creates an `Alert`
   document and emits it to every connected guardian socket.
5. The dashboard renders the alert in real time and lets a human resolve it.

## Architecture

| Layer        | Responsibility                                              | Tech                                         |
| ------------ | ----------------------------------------------------------- | -------------------------------------------- |
| Frontend     | Chat UI, auth, guardian dashboard                           | React 19, Vite, Tailwind v4, socket.io-client|
| API Gateway  | REST endpoints, sockets, auth, alert orchestration          | Node 18+, Express 5, Socket.IO 4, Mongoose   |
| ML Service   | Cyberbullying classification with conversational context    | FastAPI, 🤗 Transformers, PyTorch            |
| Data         | Users, groups, messages, alerts                             | MongoDB                                      |

The three services are independent and can be deployed and scaled separately.
The Node backend is the only component that talks to MongoDB; the ML service
is **stateless** apart from in-memory conversation windows.

## Project Structure

```
GuardianAI/
├── backend/                      # Node + Express + Socket.IO API
│   ├── src/
│   │   ├── controllers/          # auth, user, message, group controllers
│   │   ├── db/connectDb.js       # Mongoose connection
│   │   ├── middleware/           # auth + error handlers
│   │   ├── models/               # User, Message, Group, Alert (Mongoose)
│   │   ├── routes/               # /auth /users /messages /groups /alerts
│   │   ├── socket/socketHandler.js  # Socket.IO + ML bridge
│   │   ├── utils/jwt.js          # access / refresh token helpers
│   │   └── server.js             # entry point
│   ├── .env.example
│   └── package.json
│
├── python/                       # FastAPI ML microservice
│   ├── app.py                    # /analyze-conversation endpoint
│   └── requirements.txt
│
├── src/                          # React (Vite) frontend
│   ├── components/
│   │   ├── auth/                 # Login, Signup
│   │   ├── chat/                 # ChatWindow, MessageList, MessageInput, ChatHeader
│   │   ├── common/               # Avatar, Loader, Toast
│   │   ├── contacts/             # contact list & search
│   │   ├── groups/               # group create / settings
│   │   └── layout/               # Header, Sidebar
│   ├── context/                  # AuthContext, SocketContext
│   ├── pages/                    # AuthPage, ChatPage, PageDashboard (guardian)
│   ├── services/                 # api.js (axios), socket.js
│   ├── utils/helper.js
│   ├── App.jsx
│   └── main.jsx
│
├── public/                       # Vite static assets
├── index.html                    # Vite entry HTML
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── package.json                  # Frontend deps & scripts
```

## Tech Stack

**Frontend** — React 19, React Router 7, Vite 7, Tailwind CSS v4,
socket.io-client, axios (with token refresh interceptor), react-toastify,
lucide-react.

**Backend** — Node.js, Express 5, Socket.IO 4, Mongoose 8, JSON Web Tokens,
bcrypt + bcryptjs, cookie-parser, CORS, dotenv.

**ML service** — FastAPI, Uvicorn, 🤗 Transformers, PyTorch.

**Database** — MongoDB (local or Atlas).

## Detection Model

The FastAPI service wraps a HuggingFace `text-classification` pipeline pointed
at a local model directory. Out of the box it expects a binary classifier with
labels `LABEL_0` (safe) and `LABEL_1` (bullying); confidence is taken from
the model's softmax score.

**Bullying categories tracked**

| Category        | Description                                       |
| --------------- | ------------------------------------------------- |
| Harassment      | Repeated unwanted contact or behavior             |
| Threatening     | Direct or implied threats of harm                 |
| Sexual          | Unsolicited sexual content or advances            |
| Exclusion       | Deliberate ostracism from a group or conversation |
| Cyberstalking   | Persistent monitoring or tracking                 |
| Flaming         | Aggressive / hostile language                     |
| General         | Catch-all for other abusive language              |

**Severity levels**

| Severity  | Confidence    |
| --------- | ------------- |
| Low       | < 70 %        |
| Medium    | 70 – 85 %     |
| High      | 85 – 95 %     |
| Critical  | > 95 %        |

**Alert thresholds**

- Single-message alert: any message with confidence > 95 %.
- Pattern alert: **3 consecutive** messages each > 85 % confidence.
- Context window: last **10 messages** of the conversation.

You can swap the model by pointing `MODEL_PATH` in `python/app.py` at any
compatible HuggingFace classifier (local path or hub identifier).

## Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Python 3.9+** and pip
- **MongoDB** running locally on `mongodb://localhost:27017/` (or a MongoDB
  Atlas connection string)
- A HuggingFace-compatible cyberbullying classification model on disk
- *(Optional)* a CUDA-capable GPU for faster inference

### 1. Clone

```bash
git clone https://github.com/Kamal-Nayan-Kumar/GuardianAI.git
cd GuardianAI
```

### 2. ML API (FastAPI)

```bash
cd python
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Place your model files in python/model/ (or update MODEL_PATH in app.py),
# then start the service:
python app.py
# → ML API running on http://localhost:8000
```

> **Note:** `python/app.py` currently hard-codes `MODEL_PATH` to a Windows
> path. Edit it to point at your local model directory (e.g.
> `MODEL_PATH = "./model"`) before running.

### 3. Backend (Node + Express + Socket.IO)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — at minimum set ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET.
npm run dev
# → API running on http://localhost:5000
```

### 4. Frontend (React + Vite)

From the repo root:

```bash
npm install
npm run dev
# → App running on http://localhost:5173
```

Open <http://localhost:5173>, sign up two users in different browsers (or
incognito windows), start chatting, and watch the guardian dashboard light up
when bullying patterns are detected.

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

| Variable                  | Required | Default                          | Description                                   |
| ------------------------- | :------: | -------------------------------- | --------------------------------------------- |
| `PORT`                    |          | `5000`                           | HTTP port the Node API listens on             |
| `MONGODB_URI`             | ✓        | `mongodb://localhost:27017/`     | MongoDB connection string                     |
| `CLIENT_URL`              |          | `http://localhost:5173`          | Allowed CORS origin (the React app)           |
| `NODE_ENV`                |          | `development`                    | `development` or `production`                 |
| `ACCESS_TOKEN_SECRET`     | ✓        | —                                | Secret used to sign access JWTs               |
| `REFRESH_TOKEN_SECRET`    | ✓        | —                                | Secret used to sign refresh JWTs              |
| `ACCESS_TOKEN_EXPIRY`     |          | `15m`                            | Access token lifetime                         |
| `REFRESH_TOKEN_EXPIRY`    |          | `7d`                             | Refresh token lifetime                        |
| `ML_API_URL`              |          | `http://localhost:8000`          | FastAPI ML service URL                        |
| `PARENT_DASHBOARD_URL`    |          | `http://localhost:5173/parent-dashboard` | Deep-link used in alert notifications |

The frontend reads `VITE_API_URL` (defaults to `http://localhost:5000/api`)
from a `.env` file at the repo root if you need to override it.

## API Reference

All non-auth routes require a valid JWT (sent automatically by the frontend
via the `Authorization: Bearer …` header or the `withCredentials` cookie).

### Auth — `/api/auth`

| Method | Path        | Auth | Description                          |
| ------ | ----------- | :--: | ------------------------------------ |
| POST   | `/signup`   |  —   | Create an account                    |
| POST   | `/login`    |  —   | Email + password → access + refresh  |
| POST   | `/logout`   |  —   | Clear refresh cookie                 |
| POST   | `/refresh`  |  —   | Issue a new access token             |
| GET    | `/me`       |  ✓   | Current authenticated user           |

### Users — `/api/users`

| Method | Path        | Description                |
| ------ | ----------- | -------------------------- |
| GET    | `/all`      | List users                 |
| GET    | `/search`   | Search users by username   |
| GET    | `/:id`      | Fetch a single user        |
| PUT    | `/:userId`  | Update profile             |

### Messages — `/api/messages`

| Method | Path             | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/send`          | Send a message                       |
| GET    | `/conversation`  | Fetch a 1:1 conversation             |
| GET    | `/group`         | Fetch a group conversation           |
| POST   | `/read`          | Mark messages as read                |
| DELETE | `/delete`        | Delete a message                     |
| GET    | `/recent`        | Recent conversations for the user    |

### Groups — `/api/groups`

| Method | Path              | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | `/create`         | Create a group              |
| GET    | `/user`           | Groups the user belongs to  |
| GET    | `/:id`            | Group details               |
| POST   | `/add-member`     | Add a member                |
| POST   | `/remove-member`  | Remove a member             |
| PUT    | `/update`         | Update group metadata       |
| POST   | `/leave`          | Leave a group               |
| DELETE | `/delete`         | Delete a group              |

### Alerts — `/api/alerts`

| Method | Path                  | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| GET    | `/`                   | List the last 100 alerts (newest first)      |
| GET    | `/stats`              | `{ total, pending, critical }` counters      |
| PATCH  | `/:alertId/status`    | Update alert status (`reviewed` / `resolved` / `dismissed`) |

### ML Service — `/analyze-conversation` (FastAPI, port 8000)

Request:

```json
{ "conversation_id": "user1-user2", "text": "you are such a loser" }
```

Response:

```json
{
  "status": "analyzed",
  "is_bullying": true,
  "confidence_score": 0.93,
  "alert_triggered": false,
  "consecutive_high_scores": 2
}
```

## Real-time Events

Socket.IO is the live transport for both chat and alerts. The key events
emitted by the server include:

- `user:join` — client announces itself after connecting (carries `userId`).
- `message:new` — broadcast of a freshly persisted chat message.
- `message:read` — read receipt updates.
- `alert:new` — pushed to guardian clients when an `Alert` is created.

See `backend/src/socket/socketHandler.js` and `src/context/SocketContext.jsx`
for the full event surface.

## Dashboard Features

The guardian dashboard (`/parent-dashboard` route) is the human-in-the-loop
console for the system.

- **Live alert feed** — new alerts stream in over Socket.IO without refresh.
- **Stats panel** — total alerts, pending alerts, critical incidents.
- **Filtering** — by severity, status, or recency.
- **One-click triage** — mark as reviewed, resolved, or dismissed.
- **Victim & perpetrator cards** — usernames, avatars, and contact info.
- **Message context** — the offending message plus the rolling context that
  the model saw.
- **Timestamps** — precise incident timing for incident review.

## Scripts

### Frontend (repo root)

```bash
npm run dev       # Start Vite dev server on :5173
npm run build     # Production build to dist/
npm run preview   # Preview the production build
npm run lint      # Lint with ESLint (flat config)
```

### Backend (`backend/`)

```bash
npm run dev       # Start the Node + Socket.IO server on :5000
```

### ML service (`python/`)

```bash
python app.py                                       # Dev: uvicorn on :8000
uvicorn app:app --host 0.0.0.0 --port 8000          # Explicit
uvicorn app:app --host 0.0.0.0 --port 8000 --reload # Auto-reload during dev
```

## Security & Privacy

- **JWT auth** with separate access and refresh secrets, refresh token stored
  in an HTTP-only cookie.
- **Password hashing** with bcrypt.
- **CORS allow-listed** to `CLIENT_URL`.
- **Protected routes** via the `protect` middleware on every non-auth endpoint.
- **Minimal data exposure** — alert payloads only include the fields needed
  for triage (victim, bully, message, confidence, severity, status, timestamps).
- **In-memory ML state only** — conversation windows live in process memory
  and are not persisted by the ML service.

> The system is designed for **supervised messaging contexts** (parent /
> guardian / moderator oversight). Make sure your deployment complies with
> local laws and that monitored users are informed of the monitoring.

## Deployment

GuardianAI is three independent services — deploy each where it fits best:

- **Frontend** — `npm run build` and serve `dist/` from any static host
  (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, Nginx).
- **Backend** — any Node 18+ host (Render, Railway, Fly.io, a VPS). Set all
  required environment variables and point it at a managed MongoDB instance.
- **ML service** — `uvicorn app:app --host 0.0.0.0 --port 8000` behind a
  reverse proxy. For GPU inference, deploy to a CUDA-enabled host and set
  `CUDA_VISIBLE_DEVICES=0`.

Make sure the backend's `ML_API_URL` and `CLIENT_URL` point at the
deployed ML service and frontend respectively, and that the frontend's
`VITE_API_URL` points at the deployed backend.

## Roadmap

- [ ] Dockerfile + `docker-compose.yml` for one-command local bring-up
- [ ] Persist ML conversation windows in Redis for horizontal scaling
- [ ] Per-category fine-grained classification (currently binary)
- [ ] Email / SMS / push channels for guardian alerts
- [ ] End-to-end tests for the alert pipeline
- [ ] CI workflow (lint + build + test)

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repo and create your branch from `final`:
   `git checkout -b feat/my-feature`
2. Run `npm run lint` from the repo root before committing.
3. Open a pull request describing **what** changed and **why**.

## License

This project does not yet ship with a license file. Until one is added, all
rights are reserved by the repository owner. If you'd like to use GuardianAI
in your own project, please open an issue to discuss licensing.
