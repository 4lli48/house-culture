# Claude Code - Final Master Prompt

## ROLE
Act as a Senior Software Architect, Senior Full-Stack Engineer, UI/UX Designer, Database Architect, DevOps Engineer, QA Engineer and Technical Writer.

Treat this as a real client project, not a university assignment.

## PROJECT
Build a production-ready **Tech Inventory Management System** for **بيت الثقافة بحائل (Hail Culture House)**.

The application should feel elegant, modern, clean, responsive and professional. Use Hail Culture House as design inspiration without copying protected branding.

## GOALS
- Employees only.
- Bilingual (Arabic / English).
- Responsive.
- Secure.
- Easy to maintain.
- Easy to extend.

## STACK
Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- React Hook Form

Backend:
- Supabase only (Auth + PostgreSQL + Storage)

Deployment:
- Vercel

Version Control:
- GitHub

## FEATURES
Authentication:
- Login
- Register
- Forgot Password
- Reset Password
- Logout
- Protected Routes

Dashboard:
- Statistics
- Charts
- Recent Devices
- Recent Activity
- Quick Actions

Devices:
- Create
- Read
- Update
- Delete
- Details Page

Fields:
- Name
- Category
- Brand
- Model
- Inventory Code
- Serial Number
- Location
- Status
- Purchase Date
- Warranty Expiry
- Assigned Employee
- Notes
- Image
- CreatedAt
- UpdatedAt

Status:
Working / Broken / Maintenance / Lost

Search, Filters, Sorting, Pagination.

Dark / Light mode.

RTL / LTR.

Language switcher.

Responsive.

Toast notifications.

Confirmation dialogs.

404 page.

Profile.

Settings.

Activity Log.

## IMAGES
Create public/assets/devices.

If a matching image exists, use it.
Otherwise display a professional placeholder.
Support uploading to Supabase Storage.

## PROJECT STRUCTURE
Generate a professional folder structure.

Explain every folder and every file before generating code.

Keep reusable logic inside hooks, services, utils and components.

Avoid large files.

## DATABASE
Generate:
database.sql

Include:
- Tables
- PK/FK
- Constraints
- Indexes
- Seed Data
- RLS
- Policies

## ENVIRONMENT
Generate:
.env.example

Use placeholders only:
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

## README
Generate a complete README including:
- Installation
- Folder Structure
- Supabase Setup
- Environment Variables
- GitHub
- Vercel
- Deployment
- Improvements Made
- Extra Features Added
- Future Suggestions

Also generate CHANGELOG.md documenting major implementation decisions.

## CODING STANDARDS
- Clean Architecture
- Reusable Components
- No duplicated code
- Meaningful naming
- Clear comments
- Accessibility
- Performance optimization
- Security best practices
- Responsive design
- ESLint / Prettier style

## CREATIVE FREEDOM
You are allowed to improve any requirement whenever a better solution exists.

You may:
- Improve UI/UX
- Improve folder structure
- Improve database schema
- Improve performance
- Improve accessibility
- Improve security
- Add useful features
- Refactor code

Never remove a requested feature unless replaced by a better implementation.

Document every improvement inside README.

## OUTPUT RULES
Generate every required file.

Never skip files.

Never leave TODOs.

Never output pseudo-code.

Before each file print its relative path.

If the response limit is reached, continue automatically until every remaining file has been generated.

## FINAL SELF REVIEW
Before finishing, verify:
- All pages work.
- No console errors.
- Authentication works.
- CRUD works.
- Images work.
- Search works.
- Filters work.
- Responsive on desktop/tablet/mobile.
- Arabic and English translations complete.
- Dark mode works.
- README updated.
- CHANGELOG updated.
- No TODOs.
- Project is ready to clone, configure Supabase credentials, deploy to Vercel and use.
