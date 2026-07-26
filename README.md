# TaskFlow Backend API 🚀

TaskFlow is a robust, modular RESTful API for a Trello/Jira-style project management application built with Node.js, Express, and MongoDB.

## Features ✨
- **Authentication & Authorization**: JWT token auth, password hashing with bcrypt, role-based permission control.
- **User Management**: User profiles, avatars, and settings.
- **Projects & Boards**: Project creation, team memberships, and Kanban board organization.
- **Lists & Tasks**: Dynamic list creation, task tracking, assignments, priorities, and due dates.
- **Comments & Attachments**: Task discussions and file attachment uploads.
- **Notifications**: Internal alerts for task assignments and status updates.

## Architecture & Folder Structure 📁
```
taskflow-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── middlewares/
│   ├── utils/
│   ├── routes/
│   └── modules/
│       ├── auth/
│       ├── users/
│       ├── projects/
│       ├── boards/
│       ├── lists/
│       ├── tasks/
│       ├── comments/
│       ├── attachments/
│       └── notifications/
├── uploads/
├── .env
├── package.json
└── README.md
```

## Quick Start 🛠️
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` environment variables.
3. Start development server:
   ```bash
   npm run dev
   ```
