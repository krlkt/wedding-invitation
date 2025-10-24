# Wedding Invitation Platform

A multi-tenant SaaS platform for creating and managing personalized wedding invitation websites with subdomain-based routing.

## 🎉 Overview

This platform allows couples to create their own customized wedding invitation website with features like RSVP management, guest lists, photo galleries, and real-time updates. Each wedding gets its own subdomain (e.g., `karelsabrina-oialt.vercel.app`).

## ✨ Key Features

- **Multi-tenant Architecture** - Each wedding has its own subdomain and isolated data
- **Admin Dashboard** - Authenticated portal at `/admin` for couples to manage their wedding
- **Guest Management** - Track RSVPs, guest lists, table assignments, and check-ins
- **Content Management** - Love story timeline, locations, FAQs, dress code, bank details
- **Photo Gallery** - Upload and display wedding photos with Vercel Blob storage
- **Real-time Preview** - Live preview of wedding site changes in the dashboard
- **Feature Toggles** - Enable/disable sections like gallery, RSVP, Instagram integration
- **Session Authentication** - Secure login system with HTTP-only cookies
- **File Uploads** - Monogram, gallery photos, dress code images

## 🛠 Tech Stack

- **Framework**: Next.js 14.2.4 (App Router)
- **Language**: TypeScript 5.x
- **Database**: Turso (libSQL) with Drizzle ORM
- **UI**: Material-UI 7.x, Tailwind CSS
- **Forms**: React Hook Form
- **Animation**: Framer Motion
- **Storage**: Vercel Blob (for file uploads)
- **Testing**: Jest (unit), Playwright (E2E)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Turso account (for database)

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_auth_token

# Production Domain
NEXT_PUBLIC_BASE_URL=https://oialt.vercel.app
NEXT_PUBLIC_PRODUCTION_DOMAIN=oialt.vercel.app

# File Storage (Optional)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Admin Dashboard

Visit [http://localhost:3000/login](http://localhost:3000/login)

**Default credentials:**

- Email: `karel@wedding.com`
- Password: `changeme123`

## 📁 Project Structure

```
wedding-invitation/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes (auth, wedding, content)
│   ├── components/         # React components
│   ├── context/            # React context providers
│   ├── db/                 # Database schema and migrations
│   └── lib/                # Service layer and utilities
├── scripts/                # Database migration scripts
├── tests/                  # E2E tests (Playwright)
├── __tests__/              # Unit & integration tests (Jest)
└── specs/                  # Feature specifications
```

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Run E2E tests
yarn test:e2e

# Run linting
yarn lint

# Build for production
yarn build
```

## 🌐 Deployment

Production: `https://oialt.vercel.app`

- **Admin Dashboard**: `https://oialt.vercel.app/admin`
- **Wedding Sites**: `https://{subdomain}-oialt.vercel.app`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment instructions
- [Migration Strategy](./MIGRATION-STRATEGY.md) - Database migration documentation
- [Testing Guide](./tests/TESTING.md) - Testing procedures and guidelines

## 🏗 Architecture

### Multi-tenancy

Each wedding is isolated by `wedding_config_id`:

- Subdomain extraction via middleware
- Session-based authentication
- Row-level data isolation

### API Routes

- `/api/auth/*` - Authentication (login, logout, register, session)
- `/api/wedding/*` - Wedding configuration and features
- `/api/wedding/gallery/*` - Photo gallery management
- `/api/wedding/love-story/*` - Love story timeline
- `/api/wedding/locations/*` - Wedding locations
- `/api/wedding/faqs/*` - FAQ management

### Database Schema

Using Drizzle ORM with UUID primary keys:

- `user_accounts` - User authentication
- `wedding_configurations` - Wedding settings
- `rsvps` → `guests` (1:many relationship)
- `tables` - Table assignments
- `wishes` - Guest wishes/messages
- `groups` - Distribution groups
- Content tables (love_stories, locations, gallery_photos, etc.)

## 🔒 Security

- HTTP-only session cookies
- bcrypt password hashing
- CSRF protection via POST-only mutations
- Input validation on all forms
- SQL injection prevention via Drizzle ORM

## 📝 License

Private project - All rights reserved

## 👥 Contributing

This is a private wedding platform. Contact the maintainer for access.

## 🐛 Issues

Report issues to the project maintainer.

---

Built with ❤️ using Next.js 14 and modern web technologies.
