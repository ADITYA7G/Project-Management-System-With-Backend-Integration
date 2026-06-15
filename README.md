# TaskFlow - Modern Task Management System

TaskFlow is a professional, production-grade task management application built with a modern tech stack. It features a beautiful SaaS-like UI, Kanban board, analytics, and full-stack authentication.

## 🚀 Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Zustand (State Management)
- React Hook Form & Zod (Validation)
- Framer Motion (Animations)
- Recharts (Analytics)
- Lucide React (Icons)

**Backend:**
- FastAPI (Python)
- SQLite (Database)
- SQLAlchemy (ORM)
- JWT (Authentication)
- Pydantic (Validation)

## 🛠️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

## ✨ Key Features
- **Premium UI/UX:** Glassmorphism effects, dark mode, and smooth transitions.
- **Kanban Board:** Drag-and-drop task management using `@hello-pangea/dnd`.
- **Analytics Dashboard:** Visual insights into task distribution and completion rates.
- **Full CRUD:** Create, read, update, and delete tasks with real-time state updates.
- **JWT Auth:** Secure user registration and login.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop.
- **Advanced Filtering:** Filter by priority, status, and overdue tasks.

## 🗺️ Project Structure
- `backend/`: FastAPI application with SQLAlchemy and JWT.
- `frontend/src/app/`: Next.js App Router pages.
- `frontend/src/components/`: Reusable UI components (Dashboard, Task, Layout, Charts).
- `frontend/src/store/`: Zustand stores for auth and task state.
- `frontend/src/lib/`: Utility functions and configurations.
