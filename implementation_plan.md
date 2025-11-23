# Implementation Plan - Comprehensive Fixes

## Goal Description
Address critical security and performance issues identified in the technical review, and systematically verify and fix interactive elements (buttons, functions) across the application.

## User Review Required
> [!IMPORTANT]
> **Auth Enforcement**: I will be enabling authentication on the upload route. This means you will need to be logged in as an ADMIN to upload files.

## Proposed Changes

### Backend & API
#### [MODIFY] [src/app/api/upload/route.ts](file:///c:/Users/mhdsh/Desktop/Study-Hub/src/app/api/upload/route.ts)
- **Fix Auth Bypass**: Uncomment and enforce session checks.
- **Fix Memory Issue**: Optimize file writing to avoid loading entire file into memory if possible, or at least add strict size validation.
- **Improve Validation**: Add file type and size checks.

### Frontend Components
#### [MODIFY] [src/components/resource-card.tsx](file:///c:/Users/mhdsh/Desktop/Study-Hub/src/components/resource-card.tsx)
- **Type Safety**: Replace hardcoded strings with Prisma Enums.
- **Interactivity**: Ensure buttons have proper `onClick` handlers or Links.

#### [MODIFY] [src/lib/auth.ts](file:///c:/Users/mhdsh/Desktop/Study-Hub/src/lib/auth.ts)
- **Safety**: Fix potential runtime error in JWT callback (`token.sub!`).

### Systematic Review & Fix
I will iteratively review other key components:
- `src/components/pdf-viewer.tsx` (Review error handling)
- `src/components/navigation.tsx` (Verify links)

## Verification Plan

### Automated Tests
- Run `npm run build` to verify type safety and build integrity.
- Run `npm run lint` to catch common errors.

### Manual Verification
- I will verify the code changes by reviewing the logic to ensure:
    - Uploads are rejected without a session.
    - Large files don't crash the server (by code analysis of the stream handling).
    - Resource cards display correct colors/labels based on Enums.
