# Cambridge Hub Project - Comprehensive Technical Review Prompt

## Project Overview

**Cambridge Study Hub** is a Next.js 15 web application that provides students with access to Cambridge International Examination resources, including past papers, mark schemes, examiner reports, syllabi, notes, and textbooks. The platform features a sophisticated file management system, user authentication, and an admin interface for content management.

## Architecture & Technology Stack

### Core Framework
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5
- **Backend**: Next.js API Routes with server-side functionality
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v4 with credentials provider
- **Styling**: Tailwind CSS 4 with shadcn/ui component library
- **State Management**: React hooks (useState, useEffect) for client state
- **File Storage**: Local file system with organized directory structure

### Key Dependencies
- `@prisma/client`: Database ORM
- `next-auth`: Authentication
- `bcryptjs`: Password hashing
- `shadcn/ui`: UI component library with Radix UI primitives
- `lucide-react`: Icon library
- `tailwindcss`: Utility-first CSS framework
- `z-ai-web-dev-sdk`: AI integration capabilities

## Database Schema (Prisma)

### Core Models
```typescript
// User Management
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  password      String
  role          UserRole @default(STUDENT)
  isActive      Boolean  @default(true)
  hasBookAccess Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  downloads     Download[]
  bookmarks     Bookmark[]
  analytics     Analytics[]
}

// Subject Organization
model Subject {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "9701" for Chemistry
  name        String
  level       SubjectLevel
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  resources Resource[]
}

// Resource Management
model Resource {
  id          String        @id @default(cuid())
  title       String
  filename    String
  originalName String
  filePath    String
  fileSize    Int
  mimeType    String
  category    ResourceCategory
  description String?
  year        Int?
  paperNumber String? // e.g., "41", "42" for past papers
  isPublic    Boolean      @default(true) // false for Cambridge books
  downloadCount Int       @default(0)
  viewCount   Int          @default(0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  
  // Relations
  subjectId   String
  subject     Subject      @relation(fields: [subjectId], references: [id])
  downloads   Download[]
  bookmarks   Bookmark[]
  analytics   Analytics[]
  tags        ResourceTag[]
}

// Analytics & Tracking
model Analytics {
  id          String   @id @default(cuid())
  userId      String?
  resourceId  String?
  action      String   // "view", "download", "search", etc.
  path        String?
  ipAddress   String?
  userAgent   String?
  metadata    String?  // JSON string for additional data
  createdAt   DateTime @default(now())
  
  // Relations
  user     User?     @relation(fields: [userId], references: [id])
  resource Resource? @relation(fields: [resourceId], references: [id])
}

// Enums
enum UserRole {
  ADMIN
  STUDENT
}

enum SubjectLevel {
  IGCSE
  AS_LEVEL
  A_LEVEL
}

enum ResourceCategory {
  PAST_PAPER
  MARK_SCHEME
  EXAMINER_REPORT
  SYLLABUS
  NOTES
  BOOK
  EXTRA_MATERIALS
}
```

## Frontend Architecture

### Main Pages Structure
1. **Home Page** (`/`): Landing page with hero section, features, and resource categories
2. **Past Papers** (`/past-papers`): Browse and search past papers with advanced filtering
3. **Books** (`/books`): Access to Cambridge textbooks (requires authentication)
4. **Admin Dashboard** (`/admin`): Content management interface
5. **Authentication** (`/auth/signin`, `/auth/signup`): User authentication flows

### Key Components
- **Navigation**: Responsive navigation with user menu and mobile support
- **PDF Viewer**: Modal-based PDF viewer with zoom, rotate, and download capabilities
- **Resource Card**: Standardized card component for displaying resources
- **Admin Interface**: Complete admin panel with file upload and subject management

### State Management Pattern
```typescript
// Typical component state pattern
const [subjects, setSubjects] = useState<Subject[]>([])
const [resources, setResources] = useState<Resource[]>([])
const [loading, setLoading] = useState(true)
const [searchTerm, setSearchTerm] = useState("")
const [filters, setFilters] = useState({ subject: null, year: null, level: null })

// Data fetching with useEffect
useEffect(() => {
  fetchData()
}, [dependencies])

// API interaction
const fetchData = async () => {
  setLoading(true)
  try {
    const response = await fetch(`/api/endpoint?${params}`)
    const data = await response.json()
    setData(data)
  } catch (error) {
    console.error("Error fetching data:", error)
  } finally {
    setLoading(false)
  }
}
```

## Backend API Architecture

### API Routes Structure
```
src/app/api/
├── auth/
│   └── [...nextauth]/route.ts    # NextAuth configuration
│   ├── register/route.ts         # User registration
├── past-papers/
│   ├── route.ts                  # GET past papers with filtering
│   ├── [id]/view/route.ts        # POST increment view count
│   └── download/[id]/route.ts   # GET file download
├── books/
│   ├── route.ts                  # GET books (authenticated)
│   ├── [id]/route.ts             # POST book access
│   └── download/[id]/route.ts   # GET book download
├── subjects/route.ts             # CRUD subjects
├── upload/route.ts               # File upload with metadata extraction
└── admin/
    └── organize/route.ts         # File organization utilities
```

### Key API Patterns
```typescript
// Standard API route pattern
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build dynamic where clause
    const where: any = {}
    if (searchParams.get('subjectId')) {
      where.subjectId = searchParams.get('subjectId')
    }
    
    // Database query with Prisma
    const results = await db.resource.findMany({
      where,
      include: { subject: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## File Upload & Organization System

### Smart File Organization
```
uploads/
├── past-papers/
│   ├── 9701/          # Chemistry
│   │   ├── 2024/
│   │   └── 2023/
│   └── 0620/          # Biology
│       ├── 2024/
│       └── 2023/
├── books/
│   ├── mathematics/
│   └── physics/
└── mark-schemes/
    └── 9701/
        └── 2024/
```

### Metadata Extraction
The system automatically extracts metadata from Cambridge filename patterns:
- **Pattern**: `[SUBJECT_CODE]_[SEASON][YEAR]_qp_[PAPER_NUMBER].pdf`
- **Example**: `9701_s24_qp_11.pdf` → Chemistry AS Level Paper 1, 2024 Summer
- **Extracted**: Subject code, year, season, paper number

## Authentication & Authorization

### NextAuth Configuration
- **Strategy**: JWT sessions
- **Provider**: Credentials (email/password)
- **Roles**: ADMIN, STUDENT
- **Book Access**: Controlled by `hasBookAccess` flag
- **Session Callbacks**: Enrich session with user role and permissions

### Access Control Patterns
```typescript
// Server-side protection
const session = await getServerSession(authOptions)
if (!session || session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Client-side protection
const { data: session } = useSession()
if (session?.user.role === 'ADMIN') {
  // Show admin components
}
```

## Search & Filtering System

### Advanced Search Capabilities
1. **Multi-field search**: Title, filename, subject name, subject code
2. **Smart number detection**: Automatically search paper numbers when digits are entered
3. **Year search**: Search by year (e.g., "2024")
4. **Dynamic filtering**: Subject, year, level with real-time updates

### Search Implementation
```typescript
// Dynamic where clause building
const where: any = {
  category: 'PAST_PAPER',
  isPublic: true
}

if (search) {
  where.OR = [
    { title: { contains: search } },
    { originalName: { contains: search } },
    { subject: { name: { contains: search } } },
    { subject: { code: { contains: search } } }
  ]
  
  // Add paper number search if it's a number
  if (/^\d+$/.test(search)) {
    where.OR.push({ paperNumber: search })
  }
}
```

## PDF Viewer System

### Features
- **Modal-based viewer**: Full-screen PDF viewing with overlay
- **Zoom controls**: Zoom in/out with percentage display
- **Rotation**: 90-degree rotation increments
- **Download integration**: Direct download from viewer
- **Error handling**: Graceful fallback to download on viewer failure
- **Loading states**: Proper loading indicators

### Implementation
```typescript
// PDF Viewer Component
const PDFViewer = ({ url, title, onClose, onDownload }) => {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <object
        data={url}
        type="application/pdf"
        onLoad={() => setLoading(false)}
        onError={() => setError("Failed to load PDF")}
      />
    </div>
  )
}
```

## Admin Interface

### Key Features
1. **Subject Management**: Create new subjects with code, name, and level
2. **Bulk File Upload**: Multi-file selection with progress tracking
3. **Metadata Extraction**: Automatic parsing of Cambridge filename patterns
4. **Upload Results**: Detailed success/failure reporting
5. **File Organization**: Structured storage by category, subject, and year

### Upload Workflow
```typescript
// File upload process
1. Select multiple PDF files
2. Choose or create subject
3. Extract metadata from filenames
4. Upload files with organized directory structure
5. Create database records with extracted metadata
6. Show detailed upload results
```

## Areas for AI Review & Improvement

### 1. Code Quality & Best Practices
- **TypeScript Usage**: Review type definitions and ensure strict typing
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance**: Optimize database queries and component re-renders
- **Security**: Review authentication, authorization, and input validation
- **Code Organization**: Assess component structure and code duplication

### 2. User Experience Enhancements
- **Loading States**: Consistent loading indicators throughout the app
- **Error Messages**: User-friendly error messages and recovery options
- **Responsive Design**: Mobile-first design across all screen sizes
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Lazy loading, image optimization, bundle size analysis

### 3. Feature Enhancements
- **Advanced Search**: Full-text search, search history, suggestions
- **Filtering**: More sophisticated filtering options and saved filters
- **User Management**: Profile management, preferences, notifications
- **Analytics**: Enhanced user analytics and resource usage statistics
- **Batch Operations**: Bulk downloads, batch file management

### 4. Technical Improvements
- **Database Optimization**: Indexing, query optimization, connection pooling
- **Caching Strategy**: Implement caching for frequently accessed data
- **File Storage**: Consider cloud storage integration (S3, Cloudinary)
- **API Design**: REST API best practices, versioning, documentation
- **Testing**: Unit tests, integration tests, E2E testing setup

### 5. Security & Performance
- **Input Validation**: Comprehensive validation on all user inputs
- **Rate Limiting**: Implement rate limiting for API endpoints
- **File Upload Security**: File type validation, size limits, virus scanning
- **Performance Monitoring**: Error tracking, performance metrics
- **SEO Optimization**: Meta tags, structured data, sitemap generation

### 6. Architecture & Scalability
- **State Management**: Consider Zustand or Redux for complex state
- **API Layer**: GraphQL or tRPC for better API management
- **Microservices**: Consider service separation for scalability
- **Database**: Migration to PostgreSQL for production scalability
- **Deployment**: CI/CD pipeline, containerization, cloud deployment

## Specific Code Review Tasks

### 1. Component Review
- Review all React components for proper TypeScript usage
- Check for proper error boundaries and error handling
- Assess component reusability and prop drilling
- Evaluate performance optimization opportunities

### 2. API Route Review
- Review all API routes for proper error handling
- Check input validation and sanitization
- Assess database query efficiency
- Review authentication and authorization implementation

### 3. Database Schema Review
- Evaluate Prisma schema for normalization and relationships
- Check for missing indexes or optimization opportunities
- Review data integrity constraints
- Assess scalability of current schema

### 4. Authentication & Security Review
- Review NextAuth configuration and security settings
- Check password hashing and storage security
- Evaluate authorization patterns across the application
- Assess vulnerability to common security issues

### 5. File Management Review
- Review file upload and storage security
- Check file organization and naming conventions
- Evaluate metadata extraction accuracy
- Assess file serving and download security

### 6. UI/UX Review
- Review responsive design across all components
- Check accessibility compliance (WCAG guidelines)
- Evaluate user flow and interaction patterns
- Assess visual consistency and design system usage

## Expected Deliverables

The AI should provide:

1. **Comprehensive Code Analysis**: Detailed review of each component and API route
2. **Bug Identification**: List of bugs and issues with specific locations
3. **Performance Recommendations**: Specific optimizations for better performance
4. **Security Assessment**: Security vulnerabilities and mitigation strategies
5. **Architecture Suggestions**: Recommendations for improving code organization
6. **Feature Enhancements**: Ideas for new features and improvements
7. **Code Quality Improvements**: Specific code refactoring suggestions
8. **Testing Strategy**: Recommendations for testing implementation
9. **Deployment & Operations**: Suggestions for production deployment
10. **Documentation**: Recommendations for improving code documentation

## Review Priority Areas

1. **Critical**: Security vulnerabilities, data loss risks, broken functionality
2. **High**: Performance issues, poor user experience, code quality problems
3. **Medium**: Feature enhancements, code organization, testing gaps
4. **Low**: Documentation, minor UI improvements, nice-to-have features

This comprehensive prompt provides the AI with complete technical context to conduct a thorough review of the Cambridge Hub project and provide actionable recommendations for improvement across all aspects of the application.