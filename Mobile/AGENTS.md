# AGENTS.md - LaundriFlow Mobile Development Guide

## Project Overview
LaundriFlow is a Digital Laundry Kasir mobile app built with Expo React Native (Expo Router) + Spring Boot backend + MongoDB.

## Tech Stack
- **Frontend:** Expo SDK 54, React Native 0.81, Expo Router 6, TypeScript
- **Backend:** Spring Boot 3.3.0, Java 21, MongoDB, JWT
- **UI:** Glassmorphic design (BlurView, LinearGradient), Montserrat + Inter fonts
- **Forms:** React Hook Form + Zod validation
- **Storage:** expo-secure-store for JWT token

## Folder Structure (Mobile/app/)
```
app/
├── _layout.tsx              # Root Stack layout (registers all routes)
├── index.tsx                # Entry point - checks auth, redirects
├── (auth)/                  # Auth screens group
│   ├── _layout.tsx
│   └── login.tsx
├── (tabs)/                  # Bottom tab screens
│   ├── _layout.tsx          # Tab navigator (Dashboard, Order, Pelanggan, Profil)
│   ├── index.tsx            # Dashboard
│   ├── orders.tsx           # Order list
│   ├── customers.tsx        # Customer list
│   └── profile.tsx          # Profile & logout
├── customers/
│   ├── add.tsx              # Add customer form
│   └── [id].tsx             # Edit/delete customer
├── orders/
│   ├── add.tsx              # Create order (select customer + services)
│   ├── [id].tsx             # Order detail + status update + payment
│   └── search.tsx           # Search transactions by invoice/name/phone
├── payments/
│   └── [orderId].tsx        # Payment processing (CASH/TRANSFER)
├── reports/
│   ├── index.tsx            # Report type selector
│   └── [period].tsx         # Dynamic report (daily/weekly/monthly)
├── components/ui/
│   ├── GlassCard.tsx        # Glassmorphic card wrapper
│   ├── GlassInput.tsx       # Frosted text input with icon
│   └── PillButton.tsx       # Gradient pill button
├── constants/
│   ├── theme.ts             # Design tokens (colors, typography, spacing, radius)
│   └── api.ts               # API_BASE_URL
├── services/
│   ├── api.ts               # Base API client with JWT auth
│   ├── dashboardService.ts
│   ├── customerService.ts
│   ├── orderService.ts
│   ├── paymentService.ts
│   └── reportService.ts
├── schemas/
│   ├── AuthSchema.ts
│   └── CustomerSchema.ts
└── types/
    └── index.ts             # Shared TypeScript interfaces
```

## API Base URL
- Defined in `app/constants/api.ts` - currently `http://192.168.100.179:8080`
- The API returns `{ success: boolean, message: string, data: T }` for all endpoints

## Design System
- **Colors:** Ocean Blue (#0058bf) primary, Fluid Aqua (#00F5FF), Warm Orange (#FF9500), Bright Green (#34C759)
- **Typography:** Montserrat (headings), Inter (body/labels)
- **Radius:** Cards 24px, Inputs 16px, Buttons full (pill shape)
- **Background:** Soft gradient `['#eaf2ff', '#f7f9fb', '#e6fbff']`

## Before making changes
1. Always check the full backend API structure first (controllers, DTOs, models)
2. Always read existing component code to match conventions
3. Run `npx expo start` to test changes

## Route Patterns
- Tab screens use `(tabs)/` group with bottom tabs
- Modal/stack screens are pushed via `router.push()`
- Dynamic routes use `[param].tsx` pattern
- Types must match backend API response shapes from `types/index.ts`