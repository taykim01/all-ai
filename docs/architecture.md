# All-AI Architecture Overview

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │    │   (API Routes)  │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • React 19      │    │ • Server        │    │ • OpenAI API    │
│ • App Router    │────┤   Actions       │────┤ • Anthropic     │
│ • TypeScript    │    │ • Route         │    │ • Google AI     │
│ • Tailwind CSS  │    │   Handlers      │    │ • X.AI (Grok)   │
│ • Zustand       │    │ • Middleware    │    │ • Supabase      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Flow

### Chat Message Flow

1. **User Input** → Component captures message
2. **Client State** → Optimistic update to UI
3. **Server Action** → Process message and select AI model
4. **AI Service** → Send request to appropriate AI API
5. **Database** → Store conversation and messages
6. **Client Update** → Receive response and update UI

### AI Model Selection Flow

1. **Query Analysis** → Analyze user input characteristics
2. **Model Selection** → Use routing logic to pick best AI
3. **Fallback Logic** → Handle API failures gracefully
4. **Response Processing** → Format and validate AI response

## Component Architecture

```
App Layout
├── AuthProvider
├── ThemeProvider
├── ToastProvider
└── Main Content
    ├── Sidebar
    │   ├── ConversationList
    │   ├── NewChatButton
    │   └── UserMenu
    └── ChatArea
        ├── ChatHeader
        ├── MessageList
        │   ├── UserMessage
        │   └── AIMessage
        └── MessageInput
            ├── TextArea
            ├── ModelSelector
            └── SendButton
```

## State Management

### Global State (Zustand)

- **Auth Store**: User authentication and preferences
- **Chat Store**: Conversations and messages
- **UI Store**: Interface state (sidebar, modals, toasts)
- **AI Store**: Model selection and usage tracking

### Server State

- **Database**: Persistent data via Supabase
- **API Cache**: Response caching for performance
- **Session**: User authentication state

## Database Schema

```sql
profiles
├── id (UUID, PK)
├── name (TEXT)
├── avatar_url (TEXT)
├── preferences (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

conversations
├── id (UUID, PK)
├── title (TEXT)
├── user_id (UUID, FK)
├── settings (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

messages
├── id (UUID, PK)
├── content (TEXT)
├── role (TEXT)
├── conversation_id (UUID, FK)
├── ai_model (TEXT)
├── metadata (JSONB)
└── created_at (TIMESTAMP)
```

## API Integration

### AI Service Abstraction

```typescript
interface AIService {
  chat(messages: Message[]): Promise<AIResponse>;
  estimateCost(tokens: number): number;
  getRateLimit(): RateLimit;
}

class OpenAIService implements AIService { ... }
class AnthropicService implements AIService { ... }
class GoogleAIService implements AIService { ... }
class XAIService implements AIService { ... }
```

### Rate Limiting Strategy

- **Per User**: 50 requests/hour
- **Per IP**: 100 requests/hour
- **Per API**: Service-specific limits
- **Graceful Degradation**: Queue requests when rate limited

## Security Architecture

### Authentication Flow

1. **Supabase Auth** → Handles user registration/login
2. **JWT Tokens** → Secure API communication
3. **Row Level Security** → Database access control
4. **Server Actions** → Validated operations

### API Security

- **Environment Variables** → Secure API key storage
- **Rate Limiting** → Prevent abuse
- **Input Validation** → Sanitize all inputs
- **CORS Configuration** → Restrict origins
- **HTTPS Enforcement** → Secure transmission

## PWA Architecture

### Service Worker Features

- **Offline Support** → Cache critical resources
- **Background Sync** → Queue failed requests
- **Push Notifications** → Real-time updates
- **App Install** → Native-like experience

### Caching Strategy

- **Static Assets** → Long-term cache
- **API Responses** → Short-term cache
- **Chat History** → IndexedDB storage
- **User Preferences** → localStorage

## Performance Optimizations

### Frontend

- **Code Splitting** → Route-based chunks
- **Image Optimization** → next/image
- **Font Optimization** → next/font
- **Bundle Analysis** → Tree shaking

### Backend

- **Database Indexing** → Query optimization
- **Connection Pooling** → Efficient DB connections
- **Response Caching** → Reduce API calls
- **Edge Functions** → Global distribution

### AI Integration

- **Model Caching** → Reduce redundant calls
- **Response Streaming** → Real-time updates
- **Batch Processing** → Optimize API usage
- **Fallback Models** → Service reliability

## Monitoring and Observability

### Metrics

- **Performance**: Core Web Vitals, API response times
- **Usage**: Active users, message volume, model usage
- **Errors**: Client errors, API failures, database issues
- **Costs**: AI API usage, token consumption

### Logging

- **Structured Logs** → JSON format
- **Error Tracking** → Sentry integration
- **Performance Monitoring** → Vercel Analytics
- **User Analytics** → Privacy-compliant tracking

## Deployment Architecture

### Vercel Platform

- **Edge Runtime** → Fast global execution
- **Serverless Functions** → Auto-scaling
- **Static Generation** → Pre-built pages
- **Preview Deployments** → Safe testing

### CI/CD Pipeline

1. **Code Push** → GitHub repository
2. **Automated Tests** → Unit and integration tests
3. **Build Process** → Next.js production build
4. **Deployment** → Vercel automatic deployment
5. **Monitoring** → Health checks and alerts
