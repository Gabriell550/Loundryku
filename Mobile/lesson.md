# Lesson.md - LaundriFlow Mobile Development

## What We Built

Complete Digital Laundry Kasir mobile app integrated with Spring Boot REST API and MongoDB.

## Architecture

### Backend (Spring Boot)
- Layered: Controller → Service → Repository → MongoDB
- JWT authentication (stored in SecureStore on mobile)
- All responses wrapped in `ApiResponse<T>`: `{ success, message, data }`

### Frontend (Expo React Native)
- Expo Router file-based routing
- Bottom tabs: Dashboard, Order, Pelanggan, Profil
- Stack screens for CRUD flows
- Glassmorphic UI design

## Key Integration Points

| Screen | API Endpoint | Method | Description |
|--------|-------------|--------|-------------|
| Login | `/api/auth/login` | POST | Get JWT token |
| Dashboard | `/api/dashboard` | GET | Today's summary |
| Customer List | `/api/customers` | GET | All customers |
| Add Customer | `/api/customers` | POST | Create customer |
| Edit Customer | `/api/customers/{id}` | PUT | Update customer |
| Delete Customer | `/api/customers/{id}` | DELETE | Remove customer |
| Search Customer | `/api/customers/search?q=` | GET | Search by name/phone |
| Order List | `/api/orders` | GET | All orders |
| Create Order | `/api/orders` | POST | New order with items |
| Order Detail | `/api/orders/{id}` | GET | Single order |
| Update Status | `/api/orders/{id}/status` | PATCH | Change order status |
| Search Order | `/api/orders/search?q=` | GET | Search orders |
| Process Payment | `/api/payments` | POST | Pay an order |
| Daily Report | `/api/reports/daily` | GET | Today's report |
| Weekly Report | `/api/reports/weekly` | GET | This week's report |
| Monthly Report | `/api/reports/monthly` | GET | This month's report |

## Navigation Flow

```
Splash → Login → Dashboard (tabs)
                    ├── Order List (tab)
                    │   ├── Add Order
                    │   ├── Order Detail → Payment
                    │   └── Search
                    ├── Customer List (tab)
                    │   ├── Add Customer
                    │   └── Edit Customer
                    ├── Profile (tab)
                    │   ├── User Management
                    │   └── Logout
                    └── Quick Access (from Dashboard)
                        ├── Tambah Order
                        ├── Pelanggan
                        ├── Pembayaran (search → pay)
                        └── Laporan (daily/weekly/monthly)
```

## UI Components
- **GlassCard**: BlurView wrapper with 24px radius, semi-transparent white background
- **GlassInput**: Frosted text input with icon, 16px radius, supports password toggle
- **PillButton**: LinearGradient pill-shaped button (Ocean Blue → Fluid Aqua)

## State Management
- No Redux/Context - uses local state with `useState` + `useEffect` + `useFocusEffect`
- JWT token stored in `expo-secure-store`
- API calls via `services/api.ts` which auto-attaches Bearer token