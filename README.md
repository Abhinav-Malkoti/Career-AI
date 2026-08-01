# CareerAI

CareerAI is a full-stack starter for an AI-assisted career platform. The repository contains a React client and an Express API with Google sign-in and MongoDB-backed users.

## Features

- Google OAuth login
- JWT-based API authentication
- User records stored in MongoDB
- Client-side utilities for ATS reports, resume PDFs, and interview-question PDFs
- Tailwind CSS and Vite-powered React frontend

## Project layout

```
app/       React + TypeScript client
server/    Express + TypeScript API
```

## Prerequisites

- Node.js 20 or later
- A MongoDB connection string
- Google OAuth client credentials configured for the post-message OAuth flow

## Configuration

Create `server/.env` with the following values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
JWT_SEC=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
API_KEY_GEMINI=your-gemini-api-key
GEMINI_MODEL=gemini-3.6-flash
```

Create `app/.env.local` with the OAuth **Web application** client ID (it must use the same Google Cloud OAuth client as the server):

```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

Do not commit either environment file or its secrets. In Google Cloud Console, add `http://localhost:5173` to the OAuth client's Authorized JavaScript origins for local development. The API exchanges the authorization code using the `postmessage` redirect URI.

## Run locally

In separate terminals, install and start each project:

```powershell
cd app
npm.cmd install
npm.cmd run dev
```

```powershell
cd server
npm.cmd install
npm.cmd run build
npm.cmd run start
```

The API exposes `POST /api/user/login`. Send a Google authorization code in the JSON body:

```json
{ "code": "google-authorization-code" }
```

It returns the authenticated user and a JWT valid for 15 days. Include that token on protected requests using `Authorization: Bearer <token>`.

## Validation

Run the builds before deploying:

```powershell
cd app; npm.cmd run build
cd ../server; npm.cmd run build
```

On Windows PowerShell systems that block `npm.ps1`, use `npm.cmd` as shown above.
