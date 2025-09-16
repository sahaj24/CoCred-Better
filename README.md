# CoCred

CoCred is a comprehensive web application for tracking, managing, and verifying co-curricular activities including certificates, internships, grade-sheets, and projects.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for authentication)

### Installation

1. **Clone/Extract the project**:
   ```bash
   git clone <repository-url>
   # OR extract from ZIP file
   cd CoCred-Better
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   # NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Main app: http://localhost:3000
   - Dev navigation: http://localhost:3000/dev-nav

## 🏗️ Project Structure

### User Types
- **Students**: Access personal dashboard, view certificates
- **Authority**: Manage students, events, certificates, and faculty (replaces separate teacher/faculty roles)

### Key Features

#### Authority Dashboard
- **Role-based access** with 4 authority types:
  - Admin: Full system access
  - Faculty: Academic management
  - Club Organizer: Club events and activities  
  - Event Organizer: Event management
- **Student Management**: View, add, and manage student profiles
- **Event Management**: Create, edit, and delete events
- **Certificate Management**: Issue and approve certificates
- **Faculty Management**: Oversee faculty members and activities
- **Analytics**: Performance metrics and reporting

#### Student Dashboard
- **Personal Profile**: View and manage student information
- **Certificates**: Access earned certificates and documents
- **Events**: Browse and participate in activities

### Development Features
- **Dev Navigation** (`/dev-nav`): Quick access to all pages without authentication
- **Dev Mode**: Bypass authentication for frontend development
- **Mock Data**: Comprehensive test data for all features

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📁 Key Directories

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         
│   │   ├── authority/     # Authority dashboard and sub-pages
│   │   └── student/       # Student dashboard
│   ├── login/             # Authentication pages
│   ├── register/          # Registration pages
│   └── dev-nav/           # Development navigation
├── components/            
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── faculty/           # Faculty-specific components
├── lib/                   # Utilities and configurations
│   ├── types.ts           # TypeScript definitions
│   ├── supabase.ts        # Supabase client
│   ├── auth-context.tsx   # Authentication context
│   ├── authority-roles.ts # Role and permission system
│   └── dev-config.ts      # Development configuration
└── hooks/                 # Custom React hooks
```

## 🔧 Configuration

### Environment Variables
```bash
# Required for authentication
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (auto-detected in development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development Mode
- Set `BYPASS_AUTH: true` in `src/lib/dev-config.ts` to skip authentication
- Use `/dev-nav` page for quick navigation during development
- Mock profiles available for all user types

## 🚢 Deployment

The project is configured for easy deployment on Vercel:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on git push

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

## 🔐 Authentication Flow

1. Users select their type (Student/Authority)
2. OAuth authentication via Supabase
3. Profile creation with role assignment
4. Role-based dashboard access
5. Permission-based feature access

## 🎨 UI Components

Built with shadcn/ui for consistent design:
- Cards, Buttons, Forms
- Tables, Dialogs, Sheets
- Charts, Progress indicators
- Responsive navigation

## 📱 Responsive Design

- Mobile-first approach
- Sidebar navigation on desktop
- Collapsible menus on mobile
- Touch-friendly interactions

## 🔄 Portability

The project is designed for easy migration:
- No hardcoded paths or URLs
- Environment-based configuration
- Portable database schema
- Standard npm dependencies
- Clear separation of concerns

## 📞 Support

For issues or questions:
1. Check the `/dev-nav` page for quick testing
2. Review environment configuration
3. Verify Supabase connection
4. Check browser console for errors
