# ModernShop — Next.js App

A collaborative e-commerce platform with M-Pesa payment integration.

## Project Structure

```
modernshop/
│── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (wraps all pages)
│   │   ├── page.tsx                  # Root page → redirects to /auth/login
│   │   ├── globals.css               # Global styles / CSS variables
│   │   │
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── page.tsx          # Login page (mock auth)
│   │   │
│   │   ├── shop/
│   │   │   └── page.tsx              # Main product listing page
│   │   │
│   │   ├── collaborative-shop/
│   │   │   └── page.tsx              # Collaborative shopping page
│   │   │
│   │   ├── receipts/
│   │   │   └── page.tsx              # Order receipts list page
│   │   │
│   │   ├── checkout/
│   │   │   └── page.tsx              # Checkout page (M-Pesa payment)
│   │   │
│   │   └── api/
│   │       └── mpesa/
│   │           ├── stk-push/
│   │           │   └── route.ts      # POST /api/mpesa/stk-push
│   │           ├── status/
│   │           │   └── route.ts      # POST /api/mpesa/status (poll)
│   │           └── callback/
│   │               └── route.ts      # POST /api/mpesa/callback (webhook)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx            # Top navigation bar
│   │   │
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx       # Individual product card
│   │   │   └── ProductGrid.tsx       # Grid with sort/filter/tabs
│   │   │
│   │   ├── collaborative/
│   │   │   ├── CollaboratorsSidebar.tsx   # Left sidebar (cart progress + collabs)
│   │   │   └── InviteCollaboratorsModal.tsx  # Invite popup (triggered by Invite btn)
│   │   │
│   │   ├── receipts/
│   │   │   ├── ReceiptCard.tsx       # Single order row with View E-Receipt btn
│   │   │   └── EReceiptModal.tsx     # Full e-receipt modal popup
│   │   │
│   │   ├── checkout/
│   │   │   ├── OrderSummary.tsx      # Cart items + totals + place order btn
│   │   │   └── MpesaPaymentForm.tsx  # M-Pesa STK push payment form
│   │   │
│   │   └── email/
│   │       └── OrderConfirmationEmail.tsx  # Email template (HTML table-based)
│   │
│   ├── lib/
│   │   ├── cart-store.ts             # Zustand cart store (persisted)
│   │   ├── mpesa.ts                  # Daraja API: getToken, STK push, query
│   │   └── utils.ts                  # formatCurrency, calculateTax, cn, etc.
│   │
│   ├── data/
│   │   ├── products.ts               # 12 mock products
│   │   ├── orders.ts                 # 4 mock orders (completed/processing/refunded)
│   │   └── users.ts                  # Mock users + collaborative shop
│   │
│   └── types/
│       └── index.ts                  # TypeScript types (Product, Order, User, etc.)
│
├── public/                           # Static assets
├── .env.local.example                # Environment variables template
├── next.config.js
├── package.json
├── tsconfig.json
├── 
└── README.md
```

## Pages Overview

| Route | Page | Description |
|-------|------|-------------|
| `/` | Root | Redirects to login |
| `/auth/login` | Login | Mock login (alex@gmail.com / password123) |
| `/shop` | Shop | Product grid with category filters |
| `/collaborative-shop` | Collab Shop | Shared shopping with invite popup |
| `/receipts` | Receipts | Order history with e-receipt viewer |
| `/checkout` | Checkout | M-Pesa payment + order summary |

## M-Pesa Setup (Daraja API)

1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an app to get `Consumer Key` & `Consumer Secret`
3. Copy `.env.local.example` → `.env.local` and fill in credentials
4. For sandbox testing, use shortcode `174379` and the sandbox passkey
5. Expose your callback URL using [ngrok](https://ngrok.com) for local testing:
   ```
   ngrok http 3000
   # then set MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback
   ```

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your M-Pesa credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Zustand** — cart state management (localStorage persisted)
- **Lucide React** — icons
- **M-Pesa Daraja API** — STK Push payments
- **CSS-in-JS** (styled-jsx, built into Next.js)

## Key Features

- 🛒 **Cart** with Zustand (persists across page reloads)
- 👥 **Collaborative Shopping** with real-time-style UI
- 📧 **Invite Modal** — copy share link or send email invites
- 📄 **E-Receipt** — modal receipt viewer with download option
- 📱 **M-Pesa Payment** — STK push with polling for confirmation
- 📬 **Email Template** — HTML email for order confirmations
