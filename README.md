# Task Management System - Frontend

React + TypeScript frontend for the Task Management System, built with Vite.

## Prerequisites

- **Node.js** >= 18 (LTS 20 recommended)
- **npm** >= 9

## Setup

```bash
# 1. Navigate to the frontend directory
cd TaskManagementSystem.Frontend

# 2. Copy environment variables
cp .env.example .env

# 3. Edit .env if needed (defaults point to http://localhost:5196)

# 4. Install dependencies
npm install

# 5. Start the dev server
npm run dev
```

The app opens at **http://localhost:5173**.

## Environment Variables

| Variable           | Default                  | Description                           |
|--------------------|--------------------------|---------------------------------------|
| `VITE_API_URL`     | `http://localhost:5196`  | Backend API base URL (no trailing `/`)|
| `VITE_AUTH_ENABLED` | `true`                  | `true` = show login/register, protect routes, send Bearer token. `false` = skip auth entirely. |

## Project Structure

```
src/
  api/            # Axios client, tasksApi, authApi
  components/     # Navbar, TaskCard, FilterTabs, Layout, ProtectedRoute
  context/        # TasksContext (useReducer), AuthContext
  pages/          # TaskList, TaskForm, Login, Register
  types/          # TypeScript interfaces
  utils/          # Error parser (ProblemDetails)
  config.ts       # Reads env vars
  App.tsx         # Router + providers
  main.tsx        # Entry point
```

## Available Scripts

| Command         | Description                   |
|-----------------|-------------------------------|
| `npm run dev`   | Start Vite dev server         |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build    |
| `npm run lint`  | Run ESLint                    |

## Features

- Task CRUD (create, read, update, delete)
- Filter by status (All / Active / Completed)
- Toggle task completion (optimistic update with rollback)
- Priority badges (Low / Medium / High)
- Due date display with overdue highlighting
- Form validation matching backend constraints
- ProblemDetails error parsing for user-friendly messages
- Optional JWT authentication (toggle via env var)
- Responsive design (mobile-friendly)
