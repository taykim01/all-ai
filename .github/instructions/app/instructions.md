---
applyTo: "src/app/**"
---

# App Directory Instructions

## Overview

The `src/app` directory contains Next.js 15 App Router files including pages, layouts, API routes, and special files.

## Structure Guidelines

### Route Organization

- Use route groups `()` for organization without affecting URL structure
- `(auth)` - Authentication-related pages (login, register, forgot-password)
- `(dashboard)` - Main application pages requiring authentication
- `api/` - API route handlers

### File Conventions

- `page.tsx` - Page components (Server Components by default)
- `layout.tsx` - Layout components that wrap pages
- `loading.tsx` - Loading UI components
- `error.tsx` - Error boundary components
- `not-found.tsx` - 404 error pages
- `route.ts` - API route handlers

## Coding Standards

### Page Components

```typescript
// Use Server Components by default
export default async function ChatPage() {
  // Server-side data fetching
  const initialData = await fetchInitialData();

  return (
    <div>
      <ChatInterface initialData={initialData} />
    </div>
  );
}

// Export metadata for SEO
export const metadata = {
  title: "Chat - All-AI",
  description: "Chat with multiple AI models intelligently",
};
```

### Layout Components

```typescript
// Layouts should handle common UI and provide context
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
```

### API Routes

```typescript
// Use proper HTTP methods and status codes
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate input
    const validatedData = schema.parse(data);

    // Process request
    const result = await processRequest(validatedData);

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

## Special Requirements

### PWA Support

- Implement proper manifest.json
- Add service worker for offline functionality
- Ensure responsive design for mobile devices
- Optimize for mobile performance

### SEO & Metadata

- Use proper meta tags in layouts
- Implement Open Graph and Twitter Card metadata
- Use structured data where appropriate
- Ensure proper canonical URLs

### Error Handling

- Implement error boundaries at appropriate levels
- Provide user-friendly error messages
- Log errors for debugging purposes
- Handle both client and server errors gracefully

### Performance

- Use Suspense boundaries for loading states
- Implement proper caching strategies
- Optimize images and fonts
- Minimize layout shifts
