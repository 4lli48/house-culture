# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - Initial Release

### Added
- Complete project scaffold using React + Vite + TypeScript.
- Supabase integration for Authentication and Database.
- Full SQL schema (`database.sql`) with Row Level Security (RLS) policies.
- Tailwind CSS configuration with Dark Mode and RTL support.
- `i18next` for bilingual translation (Arabic & English).
- Zustand for lightweight authentication state management.
- Recharts for visual data representation on the Dashboard.
- Responsive layout with a collapsible sidebar and clean Header.
- Toast notifications for user feedback on CRUD operations.

### Implementation Decisions
- **TypeScript**: Adopted to ensure code reliability and better developer experience.
- **Tailwind CSS**: Used for styling to ensure rapid development and a highly maintainable utility-first approach.
- **Zustand**: Selected over Context API for Auth state to avoid unnecessary re-renders across the app.
- **Supabase**: Chosen as a complete backend-as-a-service to quickly implement secure Auth and Database operations.
