# Cambridge Study Hub - Comprehensive Technical Review

## 1. Comprehensive Code Analysis

### Component Architecture (`src/components/resource-card.tsx`)
- **Strengths**: Clean UI using `shadcn/ui` and `lucide-react`. Responsive design considerations are present.
- **Weaknesses**:
  - **Type Safety**: The `Resource` interface is manually defined and may drift from the Prisma schema. It uses `string` for `createdAt` while Prisma uses `DateTime`.
  - **Hardcoded Values**: Category colors and labels use hardcoded strings instead of the `ResourceCategory` enum.
  - **Interactivity**: The component lacks `onClick` handlers or `Link` wrappers, making it purely presentational without navigation logic.
  - **Code Duplication**: The `viewMode` logic splits the component into two distinct render trees with some duplicated logic.

### API Implementation (`src/app/api/upload/route.ts`)
- **Strengths**: Implements metadata extraction from filenames and structured file storage.
- **Critical Issues**:
  - **Security**: Authentication check is commented out (`// For now, allow uploads without authentication`).
  - **Memory Usage**: Loads entire file into memory (`file.arrayBuffer()`), which will cause OOM errors with large files.
  - **Validation**: Lacks robust file type validation (magic number checks) and file size limits.

### Database Schema (`prisma/schema.prisma`)
- **Strengths**: Well-normalized schema with clear relationships.
- **Potential Bottlenecks**:
  - `downloadCount` and `viewCount` on the `Resource` model will lead to high write contention.
  - `Analytics` table will grow indefinitely; needs a partitioning strategy or archival process.

### Authentication (`src/lib/auth.ts`)
- **Strengths**: Uses standard `next-auth` with `bcryptjs`.
- **Risks**:
  - Non-null assertion `token.sub!` could cause runtime errors if the token is malformed.
  - No rate limiting configured for login attempts.

## 2. Bug Identification

| Severity | Location | Issue | Description |
|----------|----------|-------|-------------|
| **CRITICAL** | `src/app/api/upload/route.ts:15` | **Auth Bypass** | The authentication check is commented out, allowing anyone to upload files. |
| **HIGH** | `src/app/api/upload/route.ts:96` | **Memory Leak** | `file.arrayBuffer()` loads the entire file into RAM. Concurrent uploads of large PDFs will crash the server. |
| **MEDIUM** | `src/components/resource-card.tsx:40` | **Type Safety** | Hardcoded category strings match current Enum but will break silently if Enum changes. |
| **MEDIUM** | `src/lib/auth.ts:62` | **Runtime Error** | `token.sub!` assumes sub exists. If `user.id` is missing during sign-in, this throws. |
| **LOW** | `src/lib/file-organizer.ts:68` | **Storage Waste** | Old files are not deleted after organization (commented out code). |

## 3. Performance Recommendations

1.  **Stream File Uploads**:
    - **Current**: `await file.arrayBuffer()`
    - **Recommendation**: Use Node.js streams or pipe the request directly to the file system to avoid memory pressure.
    
2.  **Optimize Counters**:
    - **Current**: Direct updates to `Resource` table for views/downloads.
    - **Recommendation**: Use Redis for real-time counters and sync to DB periodically, or rely solely on `Analytics` aggregation.

3.  **Database Indexing**:
    - **Recommendation**: Add composite indexes for common search patterns:
      - `@@index([subjectId, year])`
      - `@@index([category, isPublic])`

4.  **Image Optimization**:
    - **Recommendation**: Ensure `next/image` is used for any resource thumbnails to prevent layout shift and reduce bandwidth.

## 4. Security Assessment

### Vulnerabilities
1.  **Unrestricted File Upload**:
    - Attackers can upload malicious scripts (e.g., `.php`, `.exe`) if they rename them or if the server executes them.
    - **Fix**: Validate file magic numbers (signature) not just extensions. Store uploads outside the public web root if possible, or ensure the server config prevents execution in `uploads/`.

2.  **Missing Rate Limiting**:
    - API routes (especially auth and upload) are vulnerable to abuse.
    - **Fix**: Implement `upstash/ratelimit` or similar middleware.

3.  **Input Sanitization**:
    - Metadata extraction relies on regex. Ensure extracted strings are sanitized before DB insertion to prevent injection (though Prisma handles SQL injection, XSS is still a risk if displayed raw).

## 5. Architecture Suggestions

1.  **Shared Type Definitions**:
    - Create a `types/` package or folder that exports Prisma types extended with frontend-specific needs to avoid manual interface duplication.

2.  **Service Layer Pattern**:
    - Move logic from API routes (e.g., file processing, metadata extraction) into dedicated services (e.g., `src/services/file-service.ts`). This makes logic testable and reusable.

3.  **Centralized Config**:
    - Move hardcoded values (categories, file paths, magic numbers) to a configuration file.

## 6. Feature Enhancements

1.  **File Preview**: Generate thumbnails for PDFs using `pdf-lib` or similar during upload.
2.  **Bulk Actions**: Admin interface for bulk tagging or moving resources.
3.  **User Collections**: Allow students to create "Study Lists" (collections of resources).
4.  **Broken Link Reporter**: Allow users to flag resources that don't load.

## 7. Code Quality Improvements

1.  **Enforce Enums**: Use Prisma enums in frontend code.
    ```typescript
    import { ResourceCategory } from "@prisma/client"
    // Usage
    case ResourceCategory.PAST_PAPER: ...
    ```
2.  **Error Boundaries**: Wrap complex components like `PDFViewer` in React Error Boundaries.
3.  **Strict Mode**: Ensure `tsconfig.json` has `strict: true` and no implicit any.

## 8. Testing Strategy

1.  **Unit Tests**:
    - Test `metadata extraction` logic with various filename patterns.
    - Test `auth` callbacks.
2.  **Integration Tests**:
    - Test the full upload flow (mocking the file system).
    - Test search filters against a seeded database.
3.  **E2E Tests**:
    - Use Playwright to test the "Critical Paths": Sign up -> Login -> Search Paper -> Download.

## 9. Deployment & Operations

1.  **Dockerization**: Create a `Dockerfile` for consistent deployment.
2.  **Storage**: Move from local filesystem to S3-compatible storage (AWS S3, Cloudflare R2) for scalability and persistence across deployments (especially if using Vercel/serverless).
3.  **CI/CD**: Set up GitHub Actions to run linting and tests on PRs.

## 10. Documentation

1.  **API Docs**: Use Swagger/OpenAPI to document API endpoints.
2.  **Setup Guide**: Update `SETUP_GUIDE.md` with environment variable requirements and seed data instructions.
