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
| **Phase 8** | PDF Generation & Print | **IN PROGRESS** | Integrating high-end PDF downloaders for invoices/reports. |
| **Phase 9** | Production Deployment | **PENDING** | Deploying BE to Render, FE to Vercel, DB to MongoDB Atlas. |

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

- `[ ]` **Phase 8 — Invoice PDF Export:**
  - Standard browser `window.print()` is enabled for basic layout printing.
  - Implement a dedicated HTML-to-PDF generation tool (e.g. `html2pdf.js` or `jspdf` / `html2canvas`) on the frontend to generate download-ready PDF invoices.
  - Test generating and printing the billing invoices in the detail view page (`/billing/:id`).
- `[ ]` **Phase 8 — Security Audit & Hardening:**
  - Validate role permissions on all critical endpoints (prevent standard Sales role from deleting products/vendors).
  - Enable Express rate limiter middleware in production environments.
- `[ ]` **Phase 9 — Production Deployment Prep:**
  - Configure production build scripts.
  - Draft deployment instructions for Render (backend) and Vercel (frontend).
