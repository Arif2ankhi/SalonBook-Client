# 💇‍♀️ SalonBook — Salon Appointment & Service Booking Platform

SalonBook is a full-stack, role-based salon service and appointment booking web application. Customers can browse active salon treatments, book appointments by date and time slot, manage their requests, and pay securely for confirmed sessions via Stripe. Salon administrators have a dedicated studio dashboard to manage services, review and confirm or cancel bookings, oversee customer accounts, and track verified payment transactions.

---

## 🌐 Live Demo & Repositories

- **Live Client:** `https://your-salonbook-client.vercel.app`
- **Live API Server:** `https://your-salonbook-server.vercel.app`
- **Client Repository:** https://github.com/Arif2ankhi/SalonBook-Client
- **Server Repository:** https://github.com/Arif2ankhi/salonbook-server

---

## ✨ Key Features

### 🛍️ Public Experience
- **Landing Page & Salon Showcase:** Warm editorial design highlighting featured treatments, booking steps, and studio details.
- **Browse Services (`/services`):** Search treatments by name, filter by category, sort by price, and view only active salon services.
- **Service Details (`/services/[id]`):** View full treatment descriptions, duration, pricing, specialist details, and submit an appointment request (restricted to non-admin customers).
- **Light & Dark Theme Support:** Instant theme switching via `next-themes` across public and dashboard layouts.

### 📅 Customer Dashboard (`/dashboard/customer`)
- **Overview:** Summary cards and recent booking activity at a glance.
- **My Appointments (`/dashboard/customer/appointments`):** Filter requests (`All`, `Pending`, `Confirmed`, `Cancelled`), inspect booking details, cancel `Pending` requests, and pay for `Confirmed` appointments via Stripe Checkout.
- **Profile Management (`/dashboard/customer/profile`):** Update full name, phone number, and profile photo via ImgBB image upload while keeping role and account status read-only.

### 🛠️ Admin Dashboard (`/dashboard/admin`)
- **Studio Overview (`/dashboard/admin`):** Real-time studio metrics (Registered Customers, Active Services, Successful Payments revenue, Pending Requests, Confirmed Appointments, and Cancelled Appointments) plus recent booking activity.
- **Manage Services (`/dashboard/admin/services` & `/new`):** Create, edit, delete, and toggle `Active` / `Inactive` availability for salon treatments with ImgBB image hosting.
- **Manage Appointments (`/dashboard/admin/appointments`):** Search and filter all customer requests, view customer notes, confirm `Pending` requests, or cancel `Pending` / `Confirmed` appointments with server-enforced status rules.
- **Manage Customers (`/dashboard/admin/customers`):** View registered users and manage account access (`Active` / `Blocked`).
- **Transactions (`/dashboard/admin/transactions`):** Read-only ledger of verified Stripe payment records.
- **Admin Profile (`/dashboard/admin/profile`):** Update administrator profile details and avatar.

---

## 🧰 Technology Stack

### 🎨 Frontend (`salonbook-client`)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Lucide Icons, `next-themes`, Sonner
- **Authentication:** Better Auth & JWT Token Authorization
- **Image Hosting:** ImgBB REST API
- **Payments:** Stripe Checkout

### ⚙️ Backend (`salonbook-server`)
- **Runtime & Framework:** Node.js, Express.js (REST API)
- **Database:** MongoDB (Native MongoDB Driver — `salonbook` database)
- **Security & Auth:** JWT Authentication & Role-Based Authorization Middleware (`customer` / `admin`), CORS
- **Payment Processing:** Stripe API & Signature-Verified Webhooks

---

## 📁 Project Structure

```text
salonbook/
├── salonbook-client/                 # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/               # Sign-in & Sign-up routes
│   │   │   ├── services/             # Public catalog & dynamic [id] details
│   │   │   └── dashboard/
│   │   │       ├── customer/         # Customer overview, appointments, profile
│   │   │       ├── admin/            # Admin overview, services, appointments, customers, transactions, profile
│   │   │       └── profile/          # Shared role-aware profile route
│   │   ├── components/
│   │   │   ├── layout/               # Navbar, Footer, Logo, DashboardSidebar
│   │   │   ├── providers/            # ThemeProvider
│   │   │   └── shared/               # ProfileForm, StatusBadge, StatCard, ThemeToggle
│   │   └── lib/
│   │       ├── actions/              # API client helpers (services, appointments, users)
│   │       ├── api/                  # Backend base URL configuration
│   │       └── utils/                # ImgBB upload utility
│   └── .env.local
│
└── salonbook-server/                 # Express.js REST API
    ├── index.js                      # API routes, MongoDB connection, role & status guards
    └── .env