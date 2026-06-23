<h1 align="center">
  <br>
  🧘 ZenSub
  <br>
</h1>

<h4 align="center">A clean, intuitive subscription manager — track what you pay, cancel what you don't need.</h4>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-environment-variables">Environment Variables</a>
</p>

---

## ✨ Features

- **📋 Subscription Tracking** — Add, edit and delete all your recurring subscriptions in one place
- **💰 Multi-currency Support** — Track subscriptions in different currencies with automatic conversion (USD, EUR, GBP, and more)
- **📊 Analytics** — Visualize your spending patterns with charts powered by Recharts
- **📅 Calendar View** — See upcoming renewals at a glance on an interactive calendar
- **🔔 Smart Notifications** — Set custom email reminders before renewal dates
- **👥 Shared Subscriptions** — Split costs for shared plans (e.g. family plans) with automatic per-person price calculation
- **🗂️ Custom Categories** — Organize subscriptions with your own custom categories
- **📤 PDF Export** — Export your subscription list as a PDF report
- **🎨 Dark / Light Mode** — Seamless theme switching with `next-themes`
- **🔐 Authentication** — Sign in with Google or email/password (with email verification)
- **🧭 Onboarding Tutorial** — Interactive guided tour for first-time users powered by Driver.js

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Auth** | [Auth.js v5 (NextAuth)](https://authjs.dev/) — Google OAuth + Credentials |
| **Database** | SQLite via [Prisma ORM](https://www.prisma.io/) |
| **Email** | [Nodemailer](https://nodemailer.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **PDF** | [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) |
| **Tour** | [Driver.js](https://driverjs.com/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm, yarn, pnpm, or bun

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/ZenSub.git
cd ZenSub
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy the example below into a `.env` file at the root of the project and fill in your values:

```bash
cp .env.example .env
```

> See the [Environment Variables](#-environment-variables) section for a full reference.

**4. Set up the database**

```bash
npx prisma migrate dev
npx prisma generate
```

**5. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 📁 Project Structure

```
ZenSub/
├── app/                      # Next.js App Router
│   ├── api/                  # API route handlers
│   ├── dashboard/            # Protected dashboard pages
│   │   ├── analytics/        # Spending analytics & charts
│   │   ├── calendar/         # Renewal calendar view
│   │   ├── notifications/    # Notification rules management
│   │   └── settings/         # User settings (currency, profile…)
│   ├── login/                # Sign-in page
│   ├── signup/               # Sign-up page
│   ├── new-verification/     # Email verification page
│   ├── contact/              # Contact page
│   ├── privacy/              # Privacy policy
│   └── terms/                # Terms of service
│
├── components/               # Reusable React components
│   ├── dashboard/            # Dashboard-specific components
│   │   ├── subscription-list.tsx
│   │   ├── subscription-item.tsx
│   │   ├── add-subscription-form.tsx
│   │   ├── edit-subscription-form.tsx
│   │   ├── analytics/
│   │   ├── calendar/
│   │   └── notifications/
│   ├── auth/                 # Auth forms & wrappers
│   ├── ui/                   # Shared UI primitives
│   └── landing-page-content.tsx
│
├── actions/                  # Next.js Server Actions
│   ├── subscription.ts       # CRUD + auto-rollover logic
│   ├── category.ts
│   ├── notifications.ts
│   ├── register.ts
│   ├── login.ts
│   ├── settings.ts
│   └── contact.ts
│
├── lib/                      # Utility & config modules
│   ├── db.ts                 # Prisma client singleton
│   ├── currency.ts           # Exchange rate conversion
│   ├── mail.ts               # Nodemailer email helpers
│   └── tokens.ts             # Verification token logic
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/
│
├── auth.ts                   # NextAuth configuration
├── auth.config.ts            # Auth middleware config
├── middleware.ts              # Route protection middleware
└── next.config.ts
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-nextauth-secret"           # Generate with: openssl rand -base64 32

# Google OAuth (optional but recommended)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Email (Nodemailer — e.g. Gmail SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# App URL
NEXTAUTH_URL="http://localhost:3000"
```

> **Google OAuth**: Create credentials at [console.cloud.google.com](https://console.cloud.google.com/). Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (DB GUI) |
| `npx prisma migrate dev` | Apply database migrations |

---

## 🗄️ Database Schema

The core data models are:

- **User** — account info, preferred currency, auth sessions
- **Subscription** — name, price, currency, billing frequency, renewal date, category, shared status
- **Category** — user-defined labels for organizing subscriptions
- **NotificationRule** — custom reminder rules (e.g. "3 days before renewal")

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).