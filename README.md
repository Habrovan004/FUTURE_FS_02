# LeadFlow — Mini CRM

A full-stack Client Lead Management System built with React, Node.js, Express, and MongoDB. Designed to help businesses capture, track, and manage leads generated from website contact forms.

---

## Features

- **Lead Management** — Add, view, and manage leads with name, email, and source
- **Status Pipeline** — Track leads through `New → Contacted → Converted`
- **Notes & Follow-ups** — Add timestamped notes to each lead
- **JWT Authentication** — Secure admin login with token-based access control
- **Responsive UI** — Clean, professional light-mode dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas), Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Dev Tools | Nodemon, dotenv |

---

## Project Structure
 
```
FUTURE_02/
├── crm-frontend/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.jsx
│   │   │   └── LeadList.jsx
│   │   ├── pages/
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── mini-crm/              # Node.js backend
    ├── models/
    ├── server.js
    ├── .env
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Habrovan004/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2. Set up the backend

```bash
cd mini-crm
npm install
```

Create a `.env` file in the `mini-crm` folder:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`

### 3. Set up the frontend

```bash
cd ../crm-frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/leads` | Get all leads | Yes |
| POST | `/api/leads` | Create a new lead | Yes |
| PUT | `/api/leads/:id` | Update lead status | Yes |
| POST | `/api/leads/:id/notes` | Add note to lead | Yes |

---

## Screenshots

> Dashboard with lead pipeline and notes system.

---

## Skills Demonstrated

- CRUD operations with REST API design
- JWT authentication and route protection
- MongoDB database integration with Mongoose
- React state management and component architecture
- Full-stack integration (frontend ↔ backend ↔ database)
- Business workflow implementation (lead pipeline)

---

## Author

**HAGAI JOHN MKAWE** — Ardhi University  
Course Project — Full Stack Development

---

## License

This project is for academic purposes.