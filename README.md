# Cambridge Study Hub

A free, modern platform for accessing Cambridge study resources including past papers, notes, mark schemes, and syllabi. Built with Next.js, TypeScript, and Supabase.

## 🚀 Features

### Core Features
- **Free Access**: Past papers, mark schemes, notes, and syllabi are freely accessible
- **Controlled Book Access**: Cambridge books require unique login credentials
- **Role-based Permissions**: Admin and Student roles with different access levels
- **Smart Search**: Search across all resources by subject, year, or keywords
- **Auto-categorization**: Files automatically organized by filename patterns

### User Features
- **No Login Required**: Access past papers and public resources without registration
- **User Accounts**: Optional registration for bookmarks and book access
- **Download Options**: Individual files or bulk ZIP downloads
- **PDF Viewer**: View documents directly in the browser
- **Bookmarks**: Save favorite resources for quick access

### Admin Features
- **Resource Management**: Upload, organize, and manage study materials
- **User Management**: Add/remove users and control book access permissions
- **Analytics Dashboard**: Track downloads, views, and user activity
- **Bulk Upload**: Support for uploading multiple files at once
- **Announcements**: Communicate updates and study tips

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: NextAuth.js with role-based access
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (with local fallback)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom design system

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/cambridge-study-hub.git
cd cambridge-study-hub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your local development settings.

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations (for local SQLite)
npm run db:push

# Seed the database with initial data
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🚀 Deployment

### Vercel + Supabase (Recommended)

1. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your database connection string
   - Set up storage bucket for file uploads

2. **Configure Environment Variables**
   - Copy variables from `.env.example`
   - Set up in Vercel dashboard

3. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── upload/        # File upload endpoints
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin panel
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── navigation.tsx    # Main navigation
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database client
│   ├── storage.ts        # File storage service
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
└── prisma/               # Database schema and migrations
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | JWT secret key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | Yes |

### Database Schema

The application uses Prisma with the following main models:
- `User` - User accounts with roles and permissions
- `Resource` - Study materials (papers, books, notes, etc.)
- `Subject` - Cambridge subjects with codes and levels
- `Download` - Download tracking
- `Bookmark` - User bookmarks
- `Analytics` - Usage analytics
- `Announcement` - Admin announcements

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) for main actions and navigation
- **Secondary**: Gray variants for backgrounds and text
- **Success**: Green for positive actions
- **Warning**: Yellow/Orange for alerts
- **Error**: Red for destructive actions

### Components
Built with shadcn/ui components following accessibility best practices:
- Responsive design for mobile and desktop
- Dark mode support (configurable)
- Keyboard navigation
- Screen reader support

## 🔐 Security Features

- **Authentication**: NextAuth.js with secure session management
- **Authorization**: Role-based access control
- **File Security**: Private storage with signed URLs
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built into NextAuth
- **Secure Headers**: Next.js security headers

## 📊 Analytics & Monitoring

- **Usage Tracking**: Downloads, views, and user activity
- **Resource Analytics**: Most popular resources and subjects
- **User Analytics**: Active users and registration trends
- **Performance**: Vercel analytics and monitoring
- **Error Tracking**: Configurable error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components when possible
- Write clean, documented code
- Test thoroughly before submitting
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Cambridge Assessment International Education for the educational resources
- Supabase for the generous free tier
- Vercel for excellent hosting platform
- shadcn/ui for the beautiful component library

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [documentation](./docs/)
- Join our community discussions

---

Built with ❤️ for Cambridge students worldwide.