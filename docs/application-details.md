# UsaJili (Fomu) - Application Details

> Zanzibar Government User Registration System
> Domain: https://maisara.work.gd

---

## 1. Technologies Used

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.4 |
| Language | TypeScript | ^5 |
| Runtime | Node.js | — |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | ^4 |
| Component Library | shadcn/ui | ^4.4.0 |
| Forms | react-hook-form | ^7.72.1 |
| Validation | Zod | ^4.3.6 |
| ORM | Prisma | ^7.7.0 |
| Database | PostgreSQL | — |
| Database Adapter | @prisma/adapter-pg | ^7.7.0 |
| Auth Tokens | jose (JWT) | ^6.2.2 |
| Password Hashing | bcryptjs | ^3.0.3 |
| Icons | lucide-react | ^1.8.0 |
| Notifications | sonner | ^2.0.7 |
| Charts | recharts | ^3.8.1 |
| Reverse Proxy | Nginx | — |
| Hosting Panel | aaPanel / BT Panel | — |

---

## 2. Database Configuration

| Property | Value |
|---|---|
| DBMS | PostgreSQL |
| Host | localhost |
| Port | 5432 |
| Database Name | `fomudb` |
| Username | `postgres` |
| Password | `postgres` |
| Schema | `public` |
| Connection String | `postgresql://postgres:postgres@localhost:5432/fomudb?schema=public` |

Connection is managed via `PrismaPg` driver adapter in `src/lib/prisma.ts`:

```typescript
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

---

## 3. User Roles and Credentials

### 3.1 Admin Role

The application has a single hardcoded role: **admin**. Admin credentials are stored as plaintext in the `ADMIN_USERS` environment variable as comma-separated `username:password` pairs.

| Username | Password |
|---|---|
| `admin` | `Zanzibar@2024` |
| `akassim` | `Admin@123` |
| `ymrajab` | `Admin@2026` |
| `habdalla` | `Admin@123` |

Admin authentication uses **plaintext comparison** — no bcrypt hashing is applied for admin logins. The submitted username and password are directly compared against the env var values.

### 3.2 Registered User (Registrant)

Registered users are ordinary people who fill out the registration form. They **cannot log in** — they have no authentication capability. Their data is stored in the `User` database table and also appended to `data/users.md`.

---

## 4. Login Methods

| Method | Endpoint | Mechanism |
|---|---|---|
| Admin Login | `POST /api/login` | Plaintext comparison against `ADMIN_USERS` env var. On success, a JWT session cookie (`admin-session`) is set with HS256 signing, 24h expiry, role `admin`. |
| Admin Logout | `POST /api/logout` | Deletes the `admin-session` cookie |
| Session Verification | `verifySession()` | Server-side JWT decryption, checks `role === "admin"` |

### JWT Session Details

| Property | Value |
|---|---|
| Library | jose |
| Algorithm | HS256 |
| Secret | `JWT_SECRET` env var |
| Cookie Name | `admin-session` |
| Cookie Flags | httpOnly, secure (production), sameSite=lax, path=/ |
| Expiry | 24 hours |
| Payload | `{ role: "admin", expiresAt: Date }` |

---

## 5. Role Permissions Matrix

| Action | Admin | Registered User | Anonymous |
|---|---|---|---|
| Access registration form (`/`) | Yes | Yes | Yes |
| Submit registration (`POST /api/register`) | Yes | Yes | Yes |
| Access login page (`/login`) | Yes (redirected to dashboard) | No | Yes |
| Login via API (`POST /api/login`) | Yes | No | No |
| Access dashboard (`/dashboard`) | Yes | No | No |
| Download registered users (`GET /api/download`) | Yes | No | No |
| Logout (`POST /api/logout`) | Yes | No | No |

---

## 6. Database Schema Overview

### User Table

```sql
CREATE TABLE "User" (
    "id"        SERIAL NOT NULL,
    "fullName"  TEXT NOT NULL,
    "username"  TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "phone"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### Prisma Model

```prisma
model User {
  id           Int      @id @default(autoincrement())
  fullName     String
  username     String   @unique
  email        String   @unique
  phone        String
  password     String
  institution  String
  createdAt    DateTime @default(now())
}
```

| Column | Type | Constraints |
|---|---|---|
| `id` | Int | Primary key, auto-increment |
| `fullName` | String | NOT NULL |
| `username` | String | NOT NULL, UNIQUE |
| `email` | String | NOT NULL, UNIQUE |
| `phone` | String | NOT NULL |
| `password` | String | NOT NULL (bcrypt hashed, 10 salt rounds) |
| `institution` | String | NOT NULL |
| `createdAt` | DateTime | NOT NULL, defaults to `now()` |

**No enums. No relations. Single table.**

### Registration Validation Rules

| Field | Rules | Error Message (Swahili) |
|---|---|---|
| `fullName` | min 2 chars | "Jina lazima liwe na herufi 2 au zaidi" |
| `username` | min 3 chars, alphanumeric + underscore only | "Jina la mtumiaji lazima liwe na herufi 3 au zaidi" / "Jina la mtumiaji liwe na herufi, namba na _ tu" |
| `email` | valid email, must end with `.go.tz` | "Barua pepe si sahihi" / "Barua pepe lazima iishe na .go.tz" |
| `phone` | must match `0` + exactly 9 digits (10 total, starts with 0) | "Nambari ya simu lazima iwe tarakimu 10 zikianza na 0" |
| `password` | min 8 chars, at least 1 digit, at least 1 special char | "Nenosiri lazima liwe na herufi 8 au zaidi" / "Nenosiri lazima liwe na namba angalau moja" / "Nenosiri lazima liwe na alama maalum angalau moja" |
| `institution` | non-empty | "Taasisi inahitajika" |

---

## 7. Project Structure

```
usajili/
├── AGENTS.md                          # Agent instructions
├── CLAUDE.md                          # Claude Code instructions
├── .claude/
│   └── settings.local.json            # Local Claude Code permissions
├── .env                               # Environment variables
├── .user.ini                          # PHP open_basedir config (hosting panel)
├── components.json                    # shadcn/ui configuration
├── data/
│   └── users.md                       # Registered users (markdown table, plaintext passwords)
├── docs/
│   ├── application-details.md         # This file
│   └── simple_web_app_technology.md   # Existing doc
├── eslint.config.mjs
├── logo_smz.png                       # SMZ logo (Zanzibar government)
├── manage.sh                          # Service management script
├── next.config.ts                     # Next.js configuration
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── prisma/
│   ├── schema.prisma                  # Database schema
│   ├── migrations/
│   │   ├── 20260422073553_init/
│   │   │   └── migration.sql         # Initial migration
│   │   └── migration_lock.toml
│   └── prisma.config.ts               # Prisma configuration
├── public/
│   ├── logo_smz.png                   # SMZ logo (public)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── download/route.ts      # GET - Download users.md (admin only)
│   │   │   ├── login/route.ts         # POST - Admin login
│   │   │   ├── logout/route.ts        # POST - Admin logout
│   │   │   └── register/route.ts      # POST - User registration
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Dashboard page (server component, auth check)
│   │   │   └── DashboardClient.tsx    # Dashboard client (download + logout)
│   │   ├── login/
│   │   │   └── page.tsx               # Admin login page
│   │   ├── favicon.ico
│   │   ├── globals.css                # Global styles + Tailwind
│   │   ├── layout.tsx                 # Root layout (Geist font, metadata)
│   │   └── page.tsx                   # Registration form (home page)
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx             # shadcn Button
│   │       ├── card.tsx               # shadcn Card
│   │       ├── input.tsx              # shadcn Input
│   │       ├── label.tsx              # shadcn Label
│   │       └── sonner.tsx             # Sonner toast wrapper
│   ├── generated/
│   │   └── prisma/                    # Auto-generated Prisma client
│   │       ├── client.ts
│   │       ├── browser.ts
│   │       ├── enums.ts
│   │       ├── models/
│   │       │   └── User.ts
│   │       └── ...
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client instance (PrismaPg adapter)
│   │   ├── session.ts                 # JWT session management (create, verify, delete)
│   │   ├── utils.ts                   # cn() utility (clsx + tailwind-merge)
│   │   └── validations.ts             # Zod registration schema
│   └── proxy.ts                       # Intended middleware (misnamed, not active)
├── tsconfig.json
└── README.md
```

---

## 8. Environment Variables

| Variable | Value | Used By | Purpose |
|---|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/fomudb?schema=public` | `src/lib/prisma.ts`, `prisma.config.ts` | PostgreSQL connection string |
| `JWT_SECRET` | `6co0MnpIhpMTSjI2XfKkTWvCZZmxy0EpodZ4Mbe1mEA=` | `src/lib/session.ts`, `src/proxy.ts` | HMAC secret for JWT signing/verification |
| `ADMIN_USERS` | `admin:Zanzibar@2024,akassim:Admin@123,ymrajab:Admin@2026,habdalla:Admin@123` | `src/app/api/login/route.ts` | Admin credentials (comma-separated `username:password` pairs) |
| `NODE_ENV` | — | `src/lib/session.ts` | Controls `secure` flag on cookies (true in production) |

---

## 9. Management Scripts (manage.sh)

**Location:** `/home/nextjstest/usajili/manage.sh`

**Configuration:**

| Variable | Value |
|---|---|
| `FRONTEND_PORT` | 3000 |
| `PRISMA_STUDIO_PORT` | 5555 |
| `APP_DIR` | `/home/nextjstest/usajili` |
| `LOG_DIR` | `/tmp/usajili` |
| `DOMAIN` | `maisara.work.gd` |
| `DB_HOST` | localhost |
| `DB_PORT` | 5432 |
| `DB_NAME` | fomudb |
| `DB_USER` | postgres |
| `DB_PASS` | postgres |

### Commands

| Command | Description |
|---|---|
| `./manage.sh start [service]` | Start frontend, nginx, prisma-studio, or all |
| `./manage.sh stop [service]` | Stop frontend, prisma-studio, or all |
| `./manage.sh restart [service]` | Restart services |
| `./manage.sh nginx-reload` | Reload Nginx configuration |
| `./manage.sh status` | Check status of all services (DB, Nginx, Frontend, Prisma Studio) |
| `./manage.sh logs [service]` | View logs (frontend, nginx, prisma-studio, or all) |
| `./manage.sh tail-logs [service]` | Tail logs in real-time |
| `./manage.sh db-migrate` | Run `npx prisma migrate dev` |
| `./manage.sh db-generate` | Run `npx prisma generate` |
| `./manage.sh db-push` | Run `npx prisma db push` |
| `./manage.sh db-reset` | Reset database (with confirmation prompt) |
| `./manage.sh db-studio` | Start Prisma Studio |
| `./manage.sh users` | Show registered users from DB (formatted table, max 20) |
| `./manage.sh install` | Run `npm install` |
| `./manage.sh build` | Run `npm run build` |
| `./manage.sh clean` | Remove `.next`, `node_modules/.cache`, `.prisma` |
| `./manage.sh` | Interactive menu with 27 numbered options |
| `./manage.sh help` | Show help message |

### Log File Paths

| Service | Log Path |
|---|---|
| Frontend | `/tmp/usajili/frontend.log` |
| Prisma Studio | `/tmp/usajili/prisma-studio.log` |
| Nginx Access | `/www/wwwlogs/maisara.work.gd.log` |
| Nginx Error | `/www/wwwlogs/maisara.work.gd.error.log` |

---

## 10. Running the Application

### Prerequisites

- PostgreSQL running on localhost:5432 with database `fomudb`
- Node.js installed
- Nginx configured as reverse proxy (for public access)
- Environment variables set in `.env`

### Quick Start

```bash
# Install dependencies
./manage.sh install

# Generate Prisma client
./manage.sh db-generate

# Run database migrations
./manage.sh db-migrate

# Start all services
./manage.sh start
```

### Start Individual Services

```bash
./manage.sh start frontend       # Start Next.js dev server on port 3000
./manage.sh start nginx          # Start Nginx
./manage.sh start prisma-studio  # Start Prisma Studio on port 5555
```

### Check Status

```bash
./manage.sh status
```

### Access Points

| Service | URL |
|---|---|
| Registration Form | https://maisara.work.gd |
| Admin Login | https://maisara.work.gd/login |
| Admin Dashboard | https://maisara.work.gd/dashboard |
| Prisma Studio | http://localhost:5555 |
| Local (no proxy) | http://localhost:3000 |

### Next.js Configuration

`next.config.ts` allows dev origins from:
- IP: `102.207.206.40`
- Domain: `maisara.work.gd`

### Nginx Setup

Nginx acts as a reverse proxy, forwarding HTTPS requests on `maisara.work.gd` to `http://127.0.0.1:3000`. SSL termination is handled by Nginx.

---

## 11. API Endpoints

### POST /api/register

User registration endpoint.

**Request:**
```json
{
  "fullName": "string",
  "username": "string",
  "email": "string (must end with .go.tz)",
  "phone": "string (0 + 9 digits)",
  "password": "string (min 8, 1 digit, 1 special char)",
  "institution": "string"
}
```

**Responses:**

| Status | Meaning |
|---|---|
| 201 | Registration successful |
| 400 | Validation error (Zod) |
| 409 | Duplicate username or email |
| 500 | Server error |

**Side Effects:**
- Inserts user into PostgreSQL `User` table (password bcrypt-hashed)
- Appends row to `data/users.md` (password stored in plaintext)

---

### POST /api/login

Admin login endpoint.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**

| Status | Meaning |
|---|---|
| 200 | Login successful, `admin-session` cookie set |
| 401 | Invalid credentials |
| 500 | No admin users configured |

**Mechanism:** Plaintext comparison of username:password against `ADMIN_USERS` env var.

---

### POST /api/logout

Admin logout endpoint.

**Responses:**

| Status | Meaning |
|---|---|
| 200 | Logout successful, `admin-session` cookie deleted |

---

### GET /api/download

Download registered users as a markdown file (admin only).

**Auth:** Requires valid `admin-session` JWT cookie.

**Responses:**

| Status | Meaning |
|---|---|
| 200 | Returns `data/users.md` as downloadable markdown file |
| 401 | Not authenticated |
| 404 | Users file not found |

---

## Notes

- The `src/proxy.ts` file is intended as Next.js middleware (route protection for `/dashboard` and `/login`) but is **misnamed** — it should be `src/middleware.ts` with a default export named `middleware`. Actual route protection currently relies on server-side `verifySession()` calls in the dashboard page and download API.
- The application UI is entirely in **Swahili**.
- The `.go.tz` email restriction limits registration to Tanzanian government email addresses.
- Registered user passwords are stored **bcrypt-hashed** in the database but in **plaintext** in `data/users.md`.