# WasteWise - Smart Recycling Rewards System

A modern recycling rewards system that encourages and tracks recycling activities. The system consists of two web applications:

1. **User Portal** - Where users can:

   - Create and manage their accounts
   - View their recycling history
   - Track reward points
   - Update their profile
   - Access their unique barcode

2. **Machine Interface** - Simulates recycling machine that:
   - Scans user barcodes
   - Accepts different types of recyclable materials
   - Calculates points based on material type and quantity
   - Credits points to user accounts

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Prisma (Database ORM)
- NextAuth.js (Authentication)
- PostgreSQL

## Project Structure

```
waste-wise/
├── apps/
│   ├── user/        # User portal application
│   └── machine/     # Machine interface application
└── packages/
    └── shared/      # Shared types and utilities
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   # Copy example env files
   cp apps/user/.env.example apps/user/.env
   cp apps/machine/.env.example apps/machine/.env
   ```

3. Run database migrations:

   ```bash
   npm run db:migrate
   ```

4. Start development servers:

   ```bash
   # For user portal
   npm run dev:user

   # For machine interface
   npm run dev:machine
   ```

## Features

### User Portal

- User authentication (email/password)
- Dashboard with recycling history and points
- Profile management
- Personal barcode generation
- Responsive design

### Machine Interface

- Barcode scanner simulation
- Material type selection
- Weight/quantity input
- Points calculation
- Real-time user account updates
