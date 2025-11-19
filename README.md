## Task Management Dashboard

A full-stack project tracking platform built with Next.js App Router, Prisma, and MongoDB. The live environment is deployed to Vercel: https://task-management-theta-one.vercel.app

The application focuses on streamlined collaboration across teams, projects, and tasks with real-time updates powered by Next.js Server Actions and Prisma queries.

---

## ✨ Core Features

- **Secure Authentication** – Email/username login with bcrypt password hashing, JWT-based session cookies, and server-side auth guards for protected routes.
- **Team & Member Management** – Create teams, assign members with capacity settings, and organize personnel across multiple projects.
- **Project Lifecycle** – Add projects per team, attach owners, and track descriptions, timelines, and related tasks.
- **Task Board** – Create, assign, prioritize, and update tasks with statuses (`Pending`, `In Progress`, `Done`) plus priority levels (`Low`, `Medium`, `High`).
- **Activity Logs** – Automatic audit trail for key actions (e.g., reassignment, creation, updates) to keep everyone aligned.
- **Redux-powered UI State** – Client state (forms, modals, optimistic updates) handled via RTK Query APIs for tasks, projects, teams, and logs.

---

## 🧱 Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | Next.js 16 App Router, React 19, TypeScript, Tailwind 4 |
| State Mgmt | Redux Toolkit + RTK Query                               |
| Backend    | Next.js Route Handlers, Prisma                          |
| Database   | MongoDB Atlas                                           |
| Auth       | bcrypt, jose (JWT)                                      |
| Deployment | Vercel (serverless, edge caching)                       |

---

## 🗂️ Project Structure (Highlights)

- `app/api/**` – Route handlers for auth, tasks, teams, projects, reassignments, activity logs.
- `app/lib/**` – Prisma client, auth helpers, middleware.
- `app/src/components/**` – Modular UI (forms, modals, dashboards).
- `app/redux/**` – Store, hooks, RTK Query slices for API interaction.
- `prisma/schema.prisma` – MongoDB data models for users, teams, projects, tasks, and activity logs.

---

## ⚙️ Prerequisites

- Node.js 18+
- MongoDB instance/Atlas cluster
- Package manager: npm, yarn, or pnpm

---

## 🚀 Local Development

1. **Install dependencies**

   ```bash
   npm install
   # or yarn install / pnpm install
   ```

2. **Generate Prisma client**

   ```bash
   npm run prisma:generate
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   # open http://localhost:3000
   ```

4. **Optional: push schema to DB**

   ```bash
   npm run prisma:push
   ```

---

## 🔑 Environment Variables

At minimum the API requires two private variables:

```
DATABASE_URL="mongodb+srv://user:pass@cluster0.mongodb.net/taskmanager"
JWT_SECRET="task-manager-secret-key"
```

> `DATABASE_URL` is the MongoDB connection string used by Prisma.  
> `JWT_SECRET` signs the session tokens set in the auth cookies.

---

## 🧪 Testing the App

- Register a new account or use the demo credentials.
- Create a team, add members, then create a project tied to that team.
- Add tasks with different priorities/statuses and assign them to team members.
- Reassign tasks to trigger activity logs and verify the audit trail.

---

## 📦 Deployment

1. Set the same environment variables in your hosting provider (Vercel recommended).
2. Ensure `npm run postinstall` (Prisma generate) runs during build.
3. Deploy via Git push or manual import—Vercel will create serverless functions for the API routes automatically.

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

Feel free to open issues or PRs to extend workflows (e.g., notifications, reporting, kanban drag-and-drop). Happy shipping!
