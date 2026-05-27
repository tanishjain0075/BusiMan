# BusiMan — Business Management ERP

A production-grade mini ERP system for small and medium businesses.

## Features
- 🔐 JWT Authentication with Role-Based Access Control
- 📦 Inventory & Stock Management
- 🧾 GST Billing & Invoice Generation (PDF)
- 👥 Client & Vendor Management
- 📊 Dashboard Analytics
- 📑 Sales, Inventory & Customer Reports

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS + React Router |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Deployment | Vercel (FE) + Render (BE) + MongoDB Atlas |

## Project Structure
```
BusiMan/
├── client/     ← React Frontend
├── server/     ← Node.js Backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd server
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

## Development Phases
- [x] Phase 0 — Project Setup
- [ ] Phase 1 — Authentication
- [ ] Phase 2 — Dashboard Shell
- [ ] Phase 3 — Inventory Management
- [ ] Phase 4 — Client & Vendor
- [ ] Phase 5 — Billing & GST
- [ ] Phase 6 — Analytics
- [ ] Phase 7 — Reports
- [ ] Phase 8 — Security
- [ ] Phase 9 — Deployment
