# Tech Inventory Management System - Hail Culture House

A production-ready inventory management system built for بيت الثقافة بحائل (Hail Culture House).

## Features
- **Authentication**: Secure login using Supabase Auth.
- **Dashboard**: Real-time statistics, charts, and recent activities.
- **Device Management**: Full CRUD operations for tech inventory.
- **Internationalization**: Bilingual support (English / Arabic) with RTL/LTR layouts.
- **Theme**: Dark and Light mode support.
- **Responsive**: Mobile-first design using Tailwind CSS.
- **Security**: Row Level Security (RLS) configured in Supabase.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router, React Hook Form, Zustand, React-i18next
- **Backend & Database**: Supabase (PostgreSQL + Auth)
- **Deployment Target**: Vercel

## Folder Structure
- `src/components`: Reusable UI and Layout components
- `src/context`: React contexts (Theme)
- `src/hooks`: Custom React hooks (Auth, Devices)
- `src/lib`: Utility functions and Supabase client
- `src/locales`: Translation files (en/ar)
- `src/pages`: Application pages

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Supabase Setup**
   - Create a new project in Supabase.
   - Run the SQL script located in `database.sql` in the Supabase SQL Editor.
   - Get your API URL and `anon` key from Project Settings > API.

3. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Deploy!

## Improvements Made
- Replaced basic CSS with Tailwind CSS for rapid and consistent styling.
- Extracted global state into Zustand and React Context for better maintainability.
- Included robust type definitions with TypeScript to catch errors at compile-time.
- Used `recharts` for an interactive Pie Chart in the dashboard.
- Integrated `react-toastify` for accessible and clean user notifications.
