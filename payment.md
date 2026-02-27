# Payment & Cart — Implementation Details

This document describes how the cart, collaboration invites, and the M-Pesa STK Push payment flow are implemented in this project. It covers the client-side stores, the server-side STK integration, environment variables, testing steps, and troubleshooting notes.

**Overview**
- **Cart state:** The cart is managed on the client using a Zustand store (`lib/cart-store.ts`). It tracks items, quantities, and persists locally.
- **Collaborative carts:** Collaboration metadata and members are managed by the invite store (`lib/invite-store.ts`). The invite store persists to localStorage under the key `modernshop-invite`, supports inviting emails, accepting/declining, owner removal, and can sync with the server via the collaborators API.
- **Payments:** Checkout supports M-Pesa STK Push. The client triggers a server API route which uses `lib/mpesa.ts` to request STK Push from Daraja (M-Pesa sandbox/production).

**Cart & Collaboration Flow**
- **Creating a collaborative cart**: The owner opens the Invite modal (components/collaborative/InviteCollaboratorsModal.tsx), sets a cart name, and adds emails. The UI calls `useInviteStore.addCollaborators([...emails])` which:
  - deduplicates against current collaborators and invited emails,
  - adds `invited-*` placeholder collaborator objects locally with status `pending`,
  - persists the invites to the server via `POST /api/collaborators` (if available), and
  - persists state to `modernshop-invite` in localStorage.
- **Accept/Decline**: Invited users see a pending invites UI (`components/collaborative/PendingInvitesModal.tsx`) and can `acceptInvite(email, user)` or `declineInvite(email)`. Accepting replaces the `invited-*` placeholder with an active collaborator (user id/email) and removes the pending email.
- **Owner removal**: The cart owner can remove any collaborator from the sidebar (`components/collaborative/CollaboratorsSidebar.tsx`). The owner action calls `useInviteStore.removeCollaborator(email)`, which updates local state and issues a `DELETE /api/collaborators` to persist removal server-side. Removed users are redirected to `/shop`.
- **Cross-tab sync & server sync**: The store persists locally (Zustand `persist`) and also exposes `syncFromServer(shopId)` that fetches collaborators/invites from `GET /api/collaborators?shopId=...` and reconciles local state. The Navbar listens for storage changes to `modernshop-invite` and will redirect users when they are removed.

**Checkout Flow (Client-side)**
- The checkout page collects payment method and shows an `MpesaPaymentForm` component (components/checkout/MpesaPaymentForm.tsx).
- On submit, the client POSTs to `POST /api/mpesa/stk-push` with payload like:

```json
{ "phoneNumber": "2547XXXXXXXX", "amount": 100, "orderId": "ORDER-123" }
```

- The UI will poll `POST /api/mpesa/status` (or query via `lib/mpesa.ts` client endpoints) to check completion status until payment is confirmed or times out.

**Server-side STK Push Implementation**
- `lib/mpesa.ts` contains helpers for Daraja integration:
  - `getMpesaAccessToken()` — obtains an OAuth token from Daraja using consumer key/secret.
  - `generateTimestamp()` and `generatePassword()` — create the timestamp and base64 password required by the STK Push request.
  - `initiateStkPush({ phoneNumber, amount, orderId })` — calls Daraja STK push endpoint and returns the Daraja response (CheckoutRequestID, ResponseCode, etc.). It also records the transaction in `mpesa_transactions` (via Supabase service client on the server route).
  - `queryStkPushStatus(checkoutRequestId)` — queries Daraja for transaction status.
- The server route at `app/api/mpesa/stk-push/route.ts` receives the client request, calls `initiateStkPush(...)`, and returns the Daraja response to the client. It may also persist the transaction server-side if configured.

**Phone formatting rules**
- The code normalizes phone numbers before sending to Daraja: remove whitespace and leading `0`, ensure country code `254` (for Kenya) is present. Valid test phone format for sandbox: `2547XXXXXXXX`.

**Environment variables**
Make sure the following env vars are set in `.env.local` or your deployment environment:
- `MPESA_CONSUMER_KEY` — Daraja consumer key
- `MPESA_CONSUMER_SECRET` — Daraja consumer secret
- `MPESA_PARTNER_KEY` — Optional partner key used in some flows
- `MPESA_CALLBACK_URL` — Callback URL for Daraja to send asynchronous results (must be HTTPS or a valid ngrok HTTPS URL when using sandbox). Daraja rejects `http://localhost` callback URLs.
- `TEST_PHONE_NUMBER` — Local testing phone number (example: `254719607651`).
- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — required by server-side Supabase service client to persist collaborator/invite and MPesa transaction rows.

**API Endpoints**
- `POST /api/mpesa/stk-push` — Initiates an STK push. Body: `{ phoneNumber, amount, orderId }`.
- `POST /api/mpesa/status` — (project-specific) Polls transaction status for a given CheckoutRequestID or orderId.
- `GET /api/collaborators?shopId=...` — Returns persisted collaborators and invites for a given shop.
- `POST /api/collaborators` — Persist invited emails to server-side invites + collaborators table. Body: `{ shopId, emails: [] }`.
- `DELETE /api/collaborators` — Remove an invite/collaborator. Body: `{ shopId, email }`.

**Testing locally**
1. Ensure `.env.local` contains required Daraja credentials and a valid `MPESA_CALLBACK_URL` (HTTPS or ngrok URL).
2. Start the dev server: 

```bash
pnpm dev
```

3. Open the app and create a cart or join a collaborative cart.
4. Use the checkout flow and enter the test phone number `TEST_PHONE_NUMBER`.
5. Submit payment — you should get a prompt on the test phone (sandbox) for STK code. The API response will include `ResponseCode: "0"` and a `CheckoutRequestID` for polling.

Alternatively, test the API directly with curl:

```bash
curl -X POST http://localhost:3000/api/mpesa/stk-push \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"2547XXXXXXXX","amount":1,"orderId":"TEST-001"}'
```

**Troubleshooting**
- Error: `Bad Request - Invalid CallBackURL` — Daraja requires an HTTPS callback; update `MPESA_CALLBACK_URL` to a publicly accessible HTTPS endpoint (ngrok or real URL).
- Error: `Invalid credentials` — verify `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` are correct and not swapped.
- No STK prompt — confirm phone number formatting (must be `2547...` for Kenya) and that the sandbox account allows that number.
- Supabase errors in browser: ensure server code uses the service role key (server-side only) and that you do not expose `SUPABASE_SERVICE_ROLE_KEY` to client-side bundle.

**Security & Production Notes**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `MPESA_CONSUMER_SECRET` in client-side code.
- Use HTTPS callback URLs in production; consider signing/verifying callback payloads if available.
- Rate-limit or debounce checkout submissions to avoid duplicate STK pushes for the same order.

**Important files**
- `lib/mpesa.ts` — Daraja helper and token/password generation.
- `app/api/mpesa/stk-push/route.ts` — STK push server route.
- `components/checkout/MpesaPaymentForm.tsx` — Checkout UI that initiates STK push.
- `lib/invite-store.ts` — Invite/collaborator state and server sync helpers.
- `app/api/collaborators/route.ts` — Server API for persisting invites and collaborator removals.

If you want, I can also add a condensed quick-start testing script or a small README with exact curl examples and sample env file content.

---
Generated on February 27, 2026.
