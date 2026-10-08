# GrowBroo - Dynamic QR Review Card Management Platform

**GrowBroo** is a production-ready SaaS platform that turns physical QR and NFC cards into dynamic, reassignable review engines for local businesses (salons, restaurants, cafes, hotels, gyms, clinics, and retail).

---

## 🎨 Official Brand Identity & Palette

- **Brand Name**: `GrowBroo`
- **Pure Black** (`#050505`): Headings, logos, primary typography
- **Deep Growth Green** (`#006B21`): Primary actions, buttons, brand marks, icons
- **Neon Lime** (`#39E900`): CTA accents, growth badges, active indicators
- **Soft Mint** (`#E9F8E9`): Cards, section backgrounds, badges
- **Off White** (`#F7FBF7`): Core website canvas background
- **Dark Forest** (`#10251A`): Promotional panels, dark card themes, footers

---

## 🔑 Core Architecture: Dynamic Reusable QR Cards

Traditional QR cards hardcode destination links directly into the QR image matrix. If a business moves, cancels, or changes ownership, physical cards are discarded.

**With GrowBroo:**
1. Physical cards are pre-printed with a permanent platform URL:
   ```
   https://YOURDOMAIN.com/r/[publicToken]   (e.g., /r/7FhK92xQ)
   ```
2. The customer scans the card or taps via NFC.
3. The server instantly resolves the card token, looks up the assigned business, records scan telemetry (device, browser, OS, anonymized IP hash), and executes a **307 Temporary HTTP Redirect** straight to the business's official Google Review request link.
4. When a card is reassigned to another business, **the physical QR code never changes**; only the database mapping updates.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed
```bash
npx prisma db push
npm run seed
```

### 3. Run Automated Integration Tests
```bash
npm test
```
*Validates 16 automated tests covering card creation, token randomness, assignments, dynamic scans, reassignments, error states, and security.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Demo Credentials (1-Click Login on /login)

| Role | Email | Password | Assigned Business |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@revio.app` | `admin123` | Full system access |
| **Business Owner** | `owner@royalsalon.com` | `owner123` | Royal Salon NY |

---

## 📁 Key Routes

- `/` — High-converting marketing landing page
- `/login` — Authentication portal with 1-click demo logins
- `/admin` — System overview dashboard with KPIs, time series charts, and audit feed
- `/admin/businesses` — Business directory, CRUD, and Google Review URL config
- `/admin/cards` — Physical card inventory, batch generation, CSV import, bulk assignment
- `/admin/cards/[id]` — Card inspection, QR code SVG/PNG download, reassignment modal
- `/admin/qr-generator` — Live vector QR generator and high-res downloads
- `/admin/printable` — Standard CR-80 physical card designer with print styles
- `/admin/analytics` — Multi-day scan volume, hardware/device and browser telemetry
- `/admin/scan-history` — Real-time stream of all scan dispatches
- `/admin/users` — Role-based access control and user creation
- `/admin/audit-logs` — Immutable audit trail of card reassignments and destination updates
- `/admin/settings` — Brand colors, default card copy, and security rate limits
- `/dashboard` — Dedicated portal for business owners to view their cards and metrics
- `/r/[token]` — High-speed dynamic redirect endpoint (307 redirect)
- `/r/status` — User-friendly status screen for unassigned, inactive, or not-found cards
