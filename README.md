# Technical Assessment – Dynamic Project Support Management Admin Panel

## Objective

Develop a dynamic Admin Panel where the admin can create and manage projects along with customizable support modules.

The system should allow the admin to decide which type of support is enabled for each project:

*   Chat Support
*   Call Support
*   Ticket Support

Additionally, the admin should be able to track all activities related to a project by clicking on the project name.
## 🚀 Key Features

*   **Real-Time Telemetry Link:** Live, bidirectional chat communication powered by WebSockets (Socket.IO).
*   **Operational Ticketing:** Comprehensive issue tracking with priority assignments, status workflows, and technical logs.
*   **Call Orchestration:** Scheduling and logging for inbound and outbound operational calls.
*   **Cinematic HUD UI:** A dark-mode, glassmorphic interface with micro-animations and terminal-style prompts.
*   **Simulation Mode:** Built-in demo data integration allowing the frontend to run and demonstrate all features without requiring a backend connection.
*   **Secure API Architecture:** Protected backend routes with JWT authentication and Role-Based Access Control (RBAC).

## 🛠️ Technology Stack

*   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Socket.IO Client, Lucide React.
*   **Backend:** Node.js, Express, TypeScript, Socket.IO.
*   **Database:** PostgreSQL (Neon Serverless Postgres).
*   **Authentication:** JSON Web Tokens (JWT).

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   A [Neon](https://neon.tech/) PostgreSQL database (or any PostgreSQL instance)

---

## 💻 Setup Instructions

The repository is structured into two independent modules: `frontend` and `backend`. You will need to set up and run both concurrently.

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Environment Configuration:
    Create a `.env` file in the `backend/` root and configure the following variables:
    ```env
    PORT=3000
    DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
    JWT_SECRET="your_super_secret_jwt_key_here"
    NODE_ENV="development"
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *The backend will automatically initialize the required database tables on the first run and will be accessible at `http://localhost:3000`.*

### 2. Frontend Setup

1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    *The frontend will be accessible at `http://localhost:5173`. It is pre-configured to proxy `/api` and `/socket.io` requests to the backend.*

---

## 📂 Project Structure

```text
.
├── backend/                  # Express API Server
│   ├── src/
│   │   ├── controllers/      # Route logic (auth, chat, calls, tickets)
│   │   ├── db/               # PostgreSQL connection pool
│   │   ├── middleware/       # JWT protection & error handling
│   │   └── routes/           # API endpoints
│   └── server.ts             # Entry point & Socket.IO initialization
│
└── frontend/                 # React UI Client
    ├── src/
    │   ├── components/       # Reusable UI elements (Cards, Buttons, AppShell)
    │   ├── pages/            # Main views (Dashboard, ProjectDetail, Settings)
    │   ├── store/            # Global state (Zustand) & Demo Data
    │   └── lib/              # Utility functions (Tailwind merge, formatting)
    ├── index.css             # Global Tailwind and custom cinematic styles
    └── vite.config.ts        # Vite configuration & proxy settings
```

## 🔒 Simulation (Demo) Mode

If you wish to view the UI without setting up the PostgreSQL database, the platform includes a robust Simulation Mode.
1. Start the frontend server (`npm run dev`).
2. On the login screen, click the **"Preview Dashboard"** or **"Enter Simulation"** button.
3. The platform will utilize localized `demoData.ts` to populate the environment, bypassing backend API calls.
