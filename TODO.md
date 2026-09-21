# Conduit — Roadmap to 99%

**Started:** 2026-07-13 00:15 UTC
**Updated:** 2026-07-13 — Frontend fully wired, contract deploy pending

---

## Phase 1: Contract Deployment (30% → 45%)
- [ ] Fix contract build hangs on network fetch (bytecode already compiled)
- [ ] Deploy `conduit_core` to Sui testnet
- [ ] Deploy `loyalty` module to testnet
- [ ] Update `.env.local` with package ID

## Phase 2: Real Tx Integration (✅ DONE — 45% → 75%)
- [x] Create `lib/contracts.ts` — TypeScript PTB builders for all 6 contract calls
- [x] Create `lib/useConduit.ts` — unified hook for wallet + contract ops
- [x] Wire event creation → `create_event` PTB (auto-registers organizer if needed)
- [x] Wire free ticket claim → `claim_free_ticket` PTB
- [x] Wire paid ticket purchase → `purchase_ticket` PTB
- [x] Wire My Tickets → `getOwnedObjects` filtered by Ticket type
- [x] Wire event listing → query `EventCreated` events + fetch objects
- [x] Wire event detail → fetch single Event object from chain
- [x] Wire venue scanner → verify ticket object on-chain (check_in status)
- [x] Wire dashboard → organizer events from chain
- [x] Wire analytics → real stats from organizer events

## Phase 3: zkLogin Onboarding (75% → 80%)
- [ ] Integrate zkLogin (dapp-kit already connected — needs zkLogin config)
- [ ] Add "Sign in with Google" option

## Phase 4: QR Codes + Polish (✅ DONE — 80% → 90%)
- [x] Generate real QR codes from ticket object IDs (via goqr.me API)
- [x] Display QR in ticket wallet
- [x] Error boundaries across app
- [x] Loading states on all pages
- [x] Wallet connection state everywhere

## Phase 5: Secondary Market + Kiosk (90% → 95%)
- [ ] Add `list_for_resale` + `buy_from_resale` to contract
- [ ] Wire resale UI

## Phase 6: Deploy (95% → 99%)
- [ ] Deploy frontend to Vercel
- [ ] End-to-end testing

---

## Progress Log

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| 1 | ⏳ Pending | — | — | Needs network deploy |
| 2 | ✅ Done | 00:15 | — | All PTBs + queries wired |
| 3 | ⏳ Pending | — | — | zkLogin config needed |
| 4 | ✅ Done | — | — | QR + error boundaries |
| 5 | ⏳ Pending | — | — | Contract needs resale fn |
| 6 | ⏳ Pending | — | — | Vercel deploy |

---

## Architecture Summary

```
Frontend (Next.js 15)
├── lib/contracts.ts    ← PTB builders for all contract calls
├── lib/useConduit.ts   ← Unified hook (wallet + contract + state)
├── lib/sui.ts          ← SuiClient instance
├── lib/types.ts        ← Event, Ticket, Category types
├── lib/utils.ts        ← formatSui, formatDate, truncateAddress
├── components/
│   ├── navbar.tsx       ← Real wallet connection
│   ├── event-card.tsx   ← Links to /events/{id}
│   ├── ticket-card.tsx  ← Real QR codes
│   ├── qr-code.tsx      ← QR generation via API
│   └── error-boundary.tsx ← Global error handler
└── app/
    ├── page.tsx          ← Fetches events from chain
    ├── events/page.tsx   ← Lists events from chain
    ├── events/[id]/      ← Fetches event, wires purchase
    ├── my-tickets/        ← Fetches owned tickets from chain
    ├── create/            ← Calls create_event PTB
    ├── dashboard/         ← Organizer events from chain
    ├── dashboard/scan/    ← Verifies ticket on-chain
    └── dashboard/analytics/ ← Real stats

Move Contracts
├── conduit_core.move    ← Event + Ticket + Royalty
├── batch.move           ← Batch mint + batch check-in
└── loyalty.move         ← Points + tiers + rewards
```
