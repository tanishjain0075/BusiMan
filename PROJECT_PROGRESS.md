# BusiMan — Project Progress & Autonomous Workspace Tracker

This document is the single source of truth for the **BusiMan ERP** project status. It is designed to be read by the AI Assistant on start-up to understand current architectural decisions, implemented components, running local processes, and next steps without needing redundant guidance.

---

## 🏗️ 1. Project Overview & Tech Stack
- **Goal:** Production-grade business management system / mini ERP for SMBs (inventory, billing with GST, client/vendor management, RBAC, analytics, reports).
- **Frontend:** React (Vite) + Tailwind CSS + React Router v7 + Axios + React Hot Toast.
- **Backend:** Node.js + Express.js + Winston logger (CORS, Rate Limiting, Helmet security).
- **Database:** MongoDB (via Mongoose schemas with indexing).
- **Auth:** JWT token stored in `localStorage` + Role-Based Access Control (RBAC).

---

## 📊 2. Phase Roadmap & Current Status

| Phase | Description | Status | Details / Actions |
|---|---|---|---|
| **Phase 0** | Project Setup & Scaffolding | **COMPLETED** | Express backend structure + React client scaffolded. |
| **Phase 1** | Authentication & RBAC | **COMPLETED** | JWT, roles: Admin, Inv. Manager, Accountant, Sales, Viewer. |
| **Phase 2** | Dashboard Shell & Layout | **COMPLETED** | Layout with premium glassmorphic sidebar and Navbar. |
| **Phase 3** | Inventory Management | **COMPLETED** | Product/Category CRUD, low-stock warning indicators. |
| **Phase 4** | Client & Vendor Management | **COMPLETED** | Customer & Supplier ledgers with modals for CRUD. |
| **Phase 5** | Billing & GST Calculations | **COMPLETED** | Auto-invoicing, CGST/SGST/IGST, GSTIN fields, and forms. |
| **Phase 6** | Dashboard Analytics | **COMPLETED** | Revenue analytics, charts, monthly sales, stock overview. |
| **Phase 7** | Reports Dashboard | **COMPLETED** | Sales & Tax, Inventory Valuation, Customer Value tabs. |
| **Phase 8** | PDF Generation & Print | **COMPLETED** | Custom CSS print stylesheets for beautiful, full-width reports and invoices. |
| **Phase 9** | Production Deployment | **COMPLETED** | Configured Vercel SPA rewrites and fully verified end-to-end local regression test suite. |

---

## 🔌 3. Active Workspace Services (Local)

When resuming, verify that these two background processes are running:
1. **Backend Server:** Running on `http://localhost:5000` (PID managed by Node/Nodemon).
   - Local DB Connection: `mongodb://localhost:27017/busiman`.
   - Health check: `http://localhost:5000/api/health`.
2. **Frontend client (Vite):** Running on `http://localhost:5174/`.
   - Configured `.env` pointing to the backend API.

---

## 🎯 4. Autonomous Next Steps (Phases 8 & 9)

To continue work, execute the following steps:

- `[x]` **Phase 8 — Invoice PDF Export:**
  - Integrated browser print styling rules for clean document output.
  - Standardized margins, colors, and layout transitions inside index.css and Reports.jsx.
- `[x]` **Phase 8 — Security Audit & Hardening:**
  - Audited and verified all role-based authorization guards on critical controllers.
  - Fixed pre-save mongoose hashing callback issue in User.model.js.
  - Implemented automatic product inventory stock reduction upon B2B invoice generation.
- `[x]` **Phase 9 — Production Deployment Prep:**
  - Added single-page application router rewrites in vercel.json.
  - Successfully verified end-to-end regression integration test suite.
- `[x]` **Phase 10 — Standalone Desktop & Apple Glass UI:**
  - Implemented one-click batch desktop app launcher BusiMan-Desktop.bat.
  - Created promote_admin.js utility to grant and configure admin database credentials dynamically.
  - Custom-overrode CSS style bindings to render macOS Apple-style translucent blur layers and glowing energetic orange brand highlight accents.
- `[x]` **Phase 11 — Native Windows .exe App & macOS Obsidian Dark Glass Theme:**
  - Solved light theme legibility and contrast issues by introducing high-contrast Deep macOS Obsidian Dark Glassmorphism.
  - Setup root-level package.json to manage Electron & electron-builder orchestration.
  - Coded main.js Electron application window entrypoint to manage native windows and child process lifecycle.
