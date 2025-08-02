---
applyTo: "**"
---

# All-AI Design System Guidelines

## Overview

All-AI's design system is based on Glass Morphism design principles for modern AI technology and user experience. This design system aims to emphasize a futuristic feel and technological advancement while maintaining accessibility and ease of use.

## Target Audience

All-AI targets the following user segments:

- Professionals seeking to leverage the strengths of multiple AI services in an integrated manner
- Researchers and students looking for optimal AI responses
- General users with limited access to various AI models
- Business decision-makers seeking efficient AI answers

## Design Philosophy

### Glass Morphism

Glass Morphism is characterized by transparency, blur effects, and subtle borders. This design approach has the following characteristics:

1. **Transparency and Depth**: Adding depth to multiple layers to visually represent information hierarchy
2. **Blur Effects**: Soft blurring of background elements to enhance focus on content
3. **Subtle Borders**: Delicately distinguishing boundaries between elements for visual organization

## Color System

### Primary Palette

```
--glass-background: 0 0% 100% / 0.7;  /* 70% transparent white background */
--glass-border: 0 0% 100% / 0.2;      /* 20% transparent white border */
--glass-shadow: 0 0% 0% / 0.05;       /* 5% transparent shadow */

/* Light mode */
--primary: 230 80% 60%;               /* Blue-based primary color */
--secondary: 250 70% 65%;             /* Purple-based secondary color */
--accent: 190 90% 50%;                /* Teal-based accent color */

/* Dark mode */
.dark {
  --glass-background: 220 20% 20% / 0.7;  /* 70% transparent dark background */
  --glass-border: 220 20% 40% / 0.2;      /* 20% transparent border */

  --primary: 230 70% 70%;
  --secondary: 250 60% 75%;
  --accent: 190 80% 60%;
}
```

### Semantic Colors

```
--success: 160 84% 39%;               /* Green for success messages */
--warning: 43 96% 58%;                /* Yellow for warning messages */
--error: 0 91% 71%;                   /* Red for error messages */
--info: 230 80% 60%;                  /* Blue for information messages */
```

### AI Model Colors

Dedicated colors for identifying each AI model:

```
--model-gpt: 130 80% 45%;             /* ChatGPT: Green-based */
--model-claude: 250 70% 65%;          /* Claude: Purple-based */
--model-gemini: 210 100% 56%;         /* Gemini: Blue-based */
--model-grok: 15 100% 55%;            /* Grok: Red-orange based */
```

## Typography

```
--font-sans: 'Inter', system-ui, sans-serif;  /* Default font */
--font-mono: 'JetBrains Mono', monospace;    /* Code font */

/* Size system */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Weight */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line height */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing & Layout

```
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
```

## Border Radius

```
--radius-sm: 0.125rem;   /* 2px */
--radius: 0.375rem;      /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Completely round */
```

## Glass Component Styling

### Glass Card

```css
.glass-card {
  background: hsla(var(--glass-background));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid hsla(var(--glass-border));
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 30px hsla(var(--glass-shadow));
}
```

### Glass Button

```css
.glass-button {
  background: hsla(var(--glass-background));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid hsla(var(--glass-border));
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-4);
  color: hsl(var(--foreground));
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.glass-button:hover {
  background: hsla(var(--glass-background) / 0.9);
  box-shadow: 0 4px 20px hsla(var(--glass-shadow) / 0.8);
  transform: translateY(-1px);
}

.glass-button:active {
  transform: translateY(1px);
}
```

## Component Guidelines

### Buttons

Buttons are key elements of user interaction and support the following variations:

1. **Primary Glass**: Emphasized glass button for primary actions
2. **Secondary Glass**: Less emphasized glass button for secondary actions
3. **Ghost Glass**: Minimal style transparent glass button
4. **Destructive Glass**: Emphasized glass button for dangerous actions like deletion

All buttons should have appropriate styles for `:hover`, `:focus`, `:active`, and `:disabled` states.

### Input Fields

Input fields are the primary method for users to enter data and follow these guidelines:

1. All input fields use glass effects to provide a modern feel
2. Focus states are clearly indicated with border color and shadow
3. Error states are indicated with red borders and error messages
4. Input fields with icons clearly define the visual hierarchy

### Dialogs

Dialogs leverage glass effects to emphasize content hierarchy:

1. Background has a strong blur effect to direct focus to the dialog
2. The dialog itself uses glass card styling
3. Header, body, and footer sections are clearly differentiated

### Message Bubbles

As core elements of the chat interface, message bubbles have these characteristics:

1. User messages use glass effects with the primary color
2. Each AI model is identified by its model-specific color (ChatGPT is green, Claude is purple, etc.)
3. Model icon and name are clearly displayed in the message bubble
4. Loading states are represented with pulse animations

## Animations & Transitions

All animations should be smooth and meaningful, following these principles:

1. Page transitions: Fade in/out effects for smooth movement
2. Component entry/exit: Slide up/down animations for natural flow
3. Interaction feedback: Subtle transformation effects for clicks and hovers
4. Data loading: Pulse animations to indicate processing

```css
/* Basic animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Accessibility

The design system complies with WCAG 2.1 AA guidelines, ensuring:

1. Sufficient color contrast: Minimum 4.5:1 contrast ratio between text and background
2. Keyboard accessibility: All interactive elements are accessible and operable via keyboard
3. Screen reader compatibility: Appropriate ARIA attributes and meaningful alternative text
4. Reduced motion: Animations respect prefers-reduced-motion settings

## Responsive Design

Adopting a mobile-first approach to adapt to various screen sizes:

1. **Mobile (320px - 639px)**:

   - Single column layout
   - Compact components
   - Touch-friendly element sizes

2. **Tablet (640px - 1023px)**:

   - Two-column layout
   - Limited maximum width for message bubbles

3. **Desktop (1024px and above)**:
   - Multi-column layout with sidebar and main content area
   - Utilization of hover effects
   - Layout utilizing extra space

## Implementation Guidelines

1. **TailwindCSS Usage**: All values in the design system are defined as variables in the TailwindCSS configuration file
2. **Component Structure**: React components are implemented according to design system guidelines
3. **Theme Switching**: Smooth transition between light and dark modes
4. **Performance Optimization**: CPU-intensive properties like blur effects are used only where necessary

## Usage Examples

### Glass Card Component

```tsx
function GlassCard({ children, className, ...props }) {
  return (
    <div className={cn("glass-card p-6 animate-fade-in", className)} {...props}>
      {children}
    </div>
  );
}
```

### Glass Button Component

```tsx
function GlassButton({
  children,
  variant = "primary",
  size = "default",
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "glass-button",
        variant === "primary" && "bg-primary/30 text-primary-foreground",
        variant === "secondary" && "bg-secondary/30 text-secondary-foreground",
        variant === "destructive" &&
          "bg-destructive/30 text-destructive-foreground",
        size === "default" && "h-10 px-5 py-2 text-base",
        size === "sm" && "h-8 px-3 text-xs",
        size === "lg" && "h-12 px-8 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Future Considerations

1. **Dark Mode Improvements**: Optimizing glass effects for dark mode
2. **Accessibility Testing**: Regular accessibility audits and improvements
3. **Performance Monitoring**: Monitoring and optimizing performance impact of glass effects
4. **Component Extension**: Developing additional components and variations
