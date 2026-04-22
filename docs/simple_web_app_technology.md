create a simple webapp that uses next.js frontend as well as backend , that we will use to capture the following data from users, we need the data in .md file in tabulara form : 
Full Name
Username
Email Address
Phone Number
Password
Institution.

# How the App Will Work

1. User opens form
2. Fills:
   - Full Name
   - Username
   - Email
   - Phone
   - Password
   - Institution
3. Clicks **Submit**
4. Backend:
   - Receives data
   - Appends to `.md` file in table format

------

# 📝 Example Output (.md file)

```
| Full Name      | Username | Email              | Phone       | Password | Institution |
|----------------|----------|--------------------|------------|----------|-------------|
| John Doe       | johndoe  | john@email.com     | 0712345678 | ****     | UDSM        |
| Jane Smith     | janes    | jane@email.com     | 0756781234 | ****     | MUHAS       |
```

------





## Technology Stack

| Layer               | Technology                         | Version        |
| ------------------- | ---------------------------------- | -------------- |
| Framework           | Next.js (App Router)               | 16.2.3         |
| UI Library          | React                              | 19.2.4         |
| Language            | TypeScript                         | 5.x            |
| ORM                 | Prisma (with `@prisma/adapter-pg`) | 7.7.0          |
| Database            | PostgreSQL                         | (system)       |
| Styling             | Tailwind CSS                       | 4.x            |
| UI Components       | shadcn/ui (Radix UI)               | 4.2.0          |
| Charts              | Recharts                           | 3.8.1          |
| Authentication      | JWT (jose library)                 | 6.2.2          |
| Password Hashing    | bcryptjs                           | 3.0.3          |
| Form Validation     | Zod + React Hook Form              | 4.3.6 / 7.72.1 |
| Toast Notifications | Sonner                             | 2.0.7          |
| Icons               | Lucide React                       | 1.8.0          |
| Driver Adapter      | `@prisma/adapter-pg` (PrismaPg)    | 7.7.0          |
| Linting             | ESLint                             | 9.x            |

---

## Database Configuration

| Parameter         | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| DBMS              | PostgreSQL                                                   |
| Host              | localhost                                                    |
| Port              | 5432                                                         |
| Database Name     | housedb                                                      |
| Username          | `postgres`                                                   |
| Password          | `postgres`                                                   |
| Schema            | `public`                                                     |
| Connection String | `postgresql://postgres:postgres@localhost:5432/fomudb?schema=public` |

The Prisma client uses the `PrismaPg` driver adapter from `@prisma/adapter-pg` to connect to PostgreSQL, configured in `src/lib/prisma.ts`.