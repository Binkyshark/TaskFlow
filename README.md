# 🚀 TaskFlow Backend API

A production-ready RESTful API for a modern collaborative project management platform inspired by **Jira**, **Trello**, and **ClickUp**.

TaskFlow is designed using a modular architecture with clean separation of concerns, scalable services, reusable business logic, and secure authentication. It provides everything needed to manage projects, boards, tasks, team collaboration, activity tracking, dashboards, notifications, and file attachments.

---

# 📌 Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Secure password hashing using bcrypt
- Protected routes
- Role-based authorization
- User registration & login

---

## 👤 User Management

- User profile management
- Avatar support
- Team membership
- User permissions

---

## 📁 Project Management

- Create projects
- Update projects
- Archive projects
- Delete projects
- Invite team members
- Member roles
- Project ownership

---

## 📋 Kanban Boards

- Create boards
- Update boards
- Delete boards
- Multiple boards per project

---

## 📂 Lists

- Create lists
- Update lists
- Delete lists
- Drag & Drop ordering support
- Archive support

---

## ✅ Task Management

- Create tasks
- Update tasks
- Delete tasks
- Assign members
- Priority management
- Labels
- Due dates
- Completion status
- Move tasks between lists
- Position ordering

---

## 💬 Comments

- Add comments
- Edit comments
- Delete comments
- Task discussions

---

## 📎 Attachments

- Upload files
- Download attachments
- Delete attachments
- File validation
- Secure uploads

---

## 🔔 Notifications

- User notifications
- Mark notification as read
- Mark all as read
- Notification history

---

## 📊 Dashboard

Personal dashboard including:

- Overview statistics
- My assigned tasks
- Due soon tasks
- Recent activities
- Notification counters

---

## 📜 Activity Log

Automatic activity tracking for:

- Projects
- Boards
- Lists
- Tasks
- Comments
- Attachments

Each action is recorded automatically to provide a complete activity timeline and audit history.

---

# 🏗 Architecture

The project follows a modular architecture inspired by Clean Architecture principles.

```
Client
      │
      ▼
Routes
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
Models
      │
      ▼
MongoDB
```

### Project Structure

```
taskflow-backend
│
├── src
│   ├── app.js
│   ├── server.js
│   │
│   ├── config
│   │
│   ├── middlewares
│   │
│   ├── routes
│   │
│   ├── utils
│   │
│   └── modules
│       │
│       ├── auth
│       ├── users
│       ├── projects
│       ├── boards
│       ├── lists
│       ├── tasks
│       ├── comments
│       ├── attachments
│       ├── notifications
│       ├── activities
│       └── dashboard
│
├── uploads
│
├── .env
│
├── package.json
│
└── README.md
```

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Password Hashing | bcrypt |
| File Upload | Multer |
| Environment | dotenv |
| Validation | Custom Validation Middleware |

---

# 📦 API Modules

| Module | Description |
|---------|-------------|
| Auth | Authentication & Authorization |
| Users | User profiles & management |
| Projects | Project management |
| Boards | Kanban boards |
| Lists | Task lists |
| Tasks | Task management |
| Comments | Task discussions |
| Attachments | File uploads |
| Notifications | User notifications |
| Activities | Activity timeline |
| Dashboard | Aggregated dashboard |

---

# 🔒 Security

- JWT Authentication
- Protected API Routes
- Password hashing using bcrypt
- Input validation
- ObjectId validation
- Authorization checks
- File upload validation
- Centralized error handling

---

# ⚡ Performance

- Lean MongoDB queries
- Pagination support
- Promise.all for concurrent queries
- Modular services
- Reusable helpers
- Efficient indexing
- Optimized dashboard queries

---

# 📊 Dashboard Endpoints

```
GET /api/v1/dashboard
```

Returns:

- Overview
- Recent Activities
- My Tasks
- Due Soon

---

```
GET /api/v1/dashboard/overview
```

Returns project statistics.

---

```
GET /api/v1/dashboard/recent-activities
```

Returns latest activities.

---

```
GET /api/v1/dashboard/my-tasks
```

Returns tasks assigned to the current user.

---

```
GET /api/v1/dashboard/due-soon
```

Returns tasks with upcoming due dates.

---

# 📜 Activity Log

The Activity module automatically records important events such as:

- Project Created
- Project Updated
- Board Created
- Board Updated
- List Created
- List Updated
- Task Created
- Task Updated
- Task Assigned
- Task Moved
- Task Completed
- Comment Added
- Comment Updated
- Attachment Uploaded

This provides a complete timeline of all project activities.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>

cd taskflow-backend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file.

Example:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/taskflow

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d
```

---

## Run Development Server

```bash
npm run dev
```

---

## Run Production

```bash
npm start
```

---

# 📌 API Base URL

```
http://localhost:5000/api/v1
```

---

# 📈 Current Project Status

| Feature | Status |
|----------|--------|
| Authentication | ✅ |
| Users | ✅ |
| Projects | ✅ |
| Boards | ✅ |
| Lists | ✅ |
| Tasks | ✅ |
| Comments | ✅ |
| Attachments | ✅ |
| Notifications | ✅ |
| Dashboard | ✅ |
| Activity Log | ✅ |
| Search | 🚧 |
| Real-time Updates | 🚧 |
| Swagger Documentation | 🚧 |
| Unit Testing | 🚧 |
| Docker | 🚧 |
| CI/CD | 🚧 |

---

# 🎯 Future Improvements

- Global Search
- WebSocket Integration
- Real-time Notifications
- Analytics Module
- Swagger Documentation
- Unit & Integration Testing
- Docker Support
- CI/CD Pipeline
- Redis Caching
- Email Notifications

---

# 👨‍💻 Author

Developed as a production-style backend project demonstrating scalable backend architecture, modular design, RESTful API development, authentication, authorization, activity tracking, dashboard aggregation, and collaborative project management using **Node.js**, **Express**, and **MongoDB**.
