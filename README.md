# ImpactFlow

**A capstone prototype for helping nonprofit teams coordinate programs and understand community impact.**

## Problem

Nonprofit teams often manage beneficiary information, program activity, and
reporting in separate tools. This makes it harder to keep work organized and
communicate progress clearly.

## Proposed solution

ImpactFlow brings a nonprofit workspace into one web application. Team members
can create an account, explore program and reporting views, and use an optional
AI-assisted draft to get started on a program description.

## Key features

- Username/password registration and sign-in; Google sign-in is available when
  OAuth is configured.
- Workspace dashboard, beneficiary, program, reports, and settings views.
- Program creation, filtering, and browser-local saving.
- Optional AI program-description drafts based on the program name, focus area,
  and location.
- Document upload interface for common office and image formats.
- Responsive layout, profile controls, and light/dark appearance.

## Technology

- **Frontend:** React 19, Vite, React Router
- **API:** Node.js, Express 5
- **Data and authentication:** MongoDB with Mongoose, JWT, bcrypt, Passport and
  Google OAuth
- **AI integration:** configurable OpenAI-compatible chat-completions API
- **Deployment:** Netlify (frontend), Render (API)
- **Local containers:** Docker Compose and MongoDB

## Live deployment

- **Frontend:** [ImpactFlow on Netlify](https://comforting-lollipop-656d2d.netlify.app/)
- **API health check:** [ImpactFlow API on Render](https://impactflow-api.onrender.com/)

The API health check responds with `ImpactFlow Server is running`. Render's
free services may take a short time to wake after inactivity.

## Walkthrough video

**Not linked yet.** Add a hosted walkthrough video here before the final
assignment submission.

## Run locally

### Docker Compose

Prerequisites: Docker Desktop (or Docker Engine with Compose).

From the repository root:

```sh
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080). The Compose setup starts
the frontend, API, and MongoDB. To stop the services, run:

```sh
docker compose down
```

### Run the frontend and API separately

Prerequisites: Node.js 22 or later and a MongoDB instance.

1. Configure the API environment in `server/.env`:

   ```dotenv
   MONGO_URI=mongodb://localhost:27017/impactflow
   JWT_SECRET=replace-with-a-long-random-local-secret
   CLIENT_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   LLM_API_KEY=
   ```

   Google OAuth and AI drafting are optional. To enable Google sign-in, fill in
   the OAuth values and register the callback URL with the Google OAuth client.
   To enable AI drafts, set `LLM_API_KEY` on the API only. Optional provider
   settings are `LLM_BASE_URL` (defaults to `https://api.openai.com/v1`) and
   `LLM_MODEL` (defaults to `gpt-4o-mini`). Never expose provider credentials
   in frontend variables or commit them.

2. In one terminal, install and start the API:

   ```sh
   cd server
   npm ci
   npm start
   ```

3. In a second terminal, install and start the frontend:

   ```sh
   cd client
   npm ci
   ```

   Set `VITE_API_URL=http://localhost:5000` in `client/.env.local` if the API
   is not at its default local URL, then run:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173).

## Configuration reference

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGO_URI` | API | MongoDB connection string |
| `JWT_SECRET` | API | Signs authentication tokens; use a strong private value |
| `CLIENT_URL` | API | Frontend origin used by OAuth redirects |
| `GOOGLE_CLIENT_ID` | API | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | API | Optional Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | API | Optional registered Google OAuth callback |
| `LLM_API_KEY` | API | Optional provider key for AI program drafts |
| `LLM_BASE_URL` | API | Optional OpenAI-compatible provider base URL |
| `LLM_MODEL` | API | Optional model name |
| `VITE_API_URL` | Frontend build | API origin; defaults to `http://localhost:5000` |

For production, set secrets in the hosting provider's environment settings.
Google OAuth also requires the deployed API callback URL and frontend origin
to be registered in the Google Cloud OAuth client. Since Vite embeds
`VITE_API_URL` at build time, rebuild and redeploy the frontend after changing
it.

## Validation

Run the API unit tests, frontend linter, and production build from the
repository root:

```sh
npm --prefix server test
npm --prefix client run lint
npm --prefix client run build
```

## Prototype scope and data handling

ImpactFlow is a capstone prototype, not yet a production system for sensitive
beneficiary records. Dashboard and report figures and beneficiary entries are
illustrative. Program entries, organisation settings, and some profile
preferences are stored in the current browser and are not shared across users
or devices. Uploaded files use local storage; on free hosting that storage can
be temporary, and the interface does not provide complete retention or access
controls. Do not enter real beneficiary personal information or rely on these
sample records for operational decisions.

AI drafting sends only the program name, focus area, and location to the
configured model provider when a signed-in user requests a draft. Do not put
personal or confidential information in those fields. Review and edit generated
text before using it.

## Supporting documentation

- [Client setup, deployment, and feature notes](client/README.md)
- [Docker Compose configuration](docker-compose.yml)
- [Render deployment blueprint](render.yaml)
- [Open AI program-drafting pull request](https://github.com/kalviumcommunity/S92_Devadathan_Capstone_ImpactFlow/pull/25)
