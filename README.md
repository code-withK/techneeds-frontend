# TechNeeds Premium: Reimagathon Frontend
Vite + React 18 + React Router + Framer Motion + Three.js.  **Node 18+ (20 recommended).**

## Run
    npm install
    cp .env.example .env     # VITE_API_URL=http://localhost:8000
    npm run dev

If the backend (Agarwalvidu/tn_web, `npm start` on :8000) is not reachable, the app falls back to a local demo DB automatically.
Demo logins: `admin@techneeds.in / admin123` · `mentor@techneeds.in / mentor123` · `TN2026001 / tn@1234`

## Wire the real backend
Every call is in `src/api.js`. Edit the `EP` map and payloads to match the repo's routes. The AI profile endpoint should return
`{name,tags,badges[{k,d}],stats{done,total,rank,points},summary,recs[],skills[{k,v}]}`; call the LLM server-side and cache it.

## Original assets
- Logo: `src/components/Brand.jsx` (original URL; or put the file at `public/logo.png`).
- Members: `memberData` in `src/pages/Landing.jsx`: set `photo`, `x`, `linkedin` for each person.

## Structure
`pages/` Landing (3D hero) · Login · Admin · Mentor · Mentee · Leaderboard · Profile (AI) | `components/` Shell, Brand, Avatar, Globe3D
