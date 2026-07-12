# Conduit — Product Requirements Document

| Field | Value |
|-------|-------|
| **Product Name** | Conduit |
| **Tagline** | The Curated Web3 Events Hub on Sui — Discover, Attend, and Own the Best On-Chain Experiences |
| **Version** | 1.1 |
| **Date** | July 11, 2026 |
| **Status** | Draft |

---

## 1. Executive Summary

Conduit is a curated discovery platform + native ticketing system built on the Sui blockchain, primarily focused on high-quality Web3 events (conferences, hackathons, NFT drops, DAO summits, builder meetups, virtual events, parties, etc.). It supports both free and paid events, making discovery accessible while offering powerful tools and monetization for organizers. The platform combines editorial curation with seamless NFT ticketing to become the default events layer for the Sui ecosystem and broader Web3.

**Vision:** Build the go-to hub where Web3 communities discover, attend, and collect memorable on-chain experiences.

**Core Value:** Free events drive virality and user growth. Paid events + premium tools deliver clear, functional value that makes upgrading a no-brainer over time.

### MVP Goal

**Launch with 50+ quality events, strong Sui community adoption, and positive organizer feedback.**

| Metric | Target |
|--------|--------|
| Quality events on platform | 50+ |
| Sui community adoption | Active organizer & fan base |
| Organizer feedback | Positive (NPS > 50) |
| Fraud rate | 0% |
| Fan onboarding friction | Minimal (zkLogin) |

The MVP focuses on proving the core thesis: **NFT-based tickets with enforced royalties and anti-scalping work better than traditional ticketing** — and the Sui community agrees.

### Growth Strategy

**High volume of free events + healthy conversion to paid features.**

Free events drive adoption and network effects. Paid features (premium analytics, advanced ticketing, VIP packages) monetize organizers who see value in the platform.

#### Key KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Monthly Active Users (MAU) | Month 1: 500, Month 3: 2,000, Month 6: 10,000 | Wallet connections + zkLogins |
| Events Listed | Month 1: 50, Month 3: 200, Month 6: 500+ | On-chain event deployments |
| Ticket Claims (Free Events) | Growing MoM, target 10x events | On-chain ticket mints |
| Ticket Sales (Paid Events) | Healthy conversion from free → paid | Revenue-generating events |
| Conversion Rate (Free → Paid) | 15-20% of organizers upgrade | Feature tier tracking |
| Organizer Retention | 60%+ host 2+ events | Repeat organizer rate |
| Upgrade Rate | 15-20% of organizers upgrade to paid | Feature tier tracking |
| Fan Retention | 40%+ attend 2+ events | Repeat ticket buyer rate |
| Secondary Market Volume | Growing monthly, 10-20% of total tickets resold | On-chain Kiosk trades |
| Royalty Distribution | 100% of secondary sales route royalties | On-chain royalty payments |
| Loyalty Points Distributed | Points earned per ticket claim/purchase, redeemable for perks | Loyalty contract tracking |

---

## 3. Target Users

### Attendees

**Web3 users, builders, degens, NFT collectors who want easy discovery and ownership of tickets.**

| Attribute | Description |
|-----------|-------------|
| **Who they are** | Sui ecosystem participants, crypto-native event-goers, NFT enthusiasts |
| **What they want** | Easy event discovery, instant ticket ownership, fair resale market |
| **Pain points** | Scalpers inflating prices, fake tickets, hidden fees, complex crypto UX |
| **How we reach them** | Sui community channels, crypto Twitter, NFT Discords, builder events |
| **Success =** | They buy tickets, resell fairly, and come back for more events |

### Organizers

**Web3 projects, DAOs, foundations, event hosts.**

| Attribute | Description |
|-----------|-------------|
| **Who they are** | Sui projects hosting meetups/conferences, DAOs organizing community events, foundations running builder programs |
| **What they want** | Fraud-free ticketing, direct audience relationships, transparent fees, royalty enforcement |
| **Pain points** | Traditional ticketing platforms charge 10-30% fees, no audience data, scalpers exploit their events |
| **How we reach them** | Sui grants programs, founder networks, event organizer communities |
| **Success =** | They create events, sell tickets, and become repeat organizers |

### Ecosystem Partners

**Sui teams, sponsors, venues.**

| Attribute | Description |
|-----------|-------------|
| **Who they are** | Mysten Labs, Sui Foundation, sponsors backing Sui events, physical venues hosting crypto conferences |
| **What they want** | Ecosystem growth, brand visibility, seamless event experiences, data insights |
| **Pain points** | Fragmented ticketing solutions, lack of Web3-native event infrastructure, manual processes |
| **How we reach them** | Direct outreach, Sui ecosystem partnerships, conference sponsorships |
| **Success =** | They integrate Conduit into their events, sponsor features, and promote the platform |

---

## 4. Core Features

### 4.1 Discovery & Curation

| Feature | Description | Priority |
|---------|-------------|----------|
| Event browsing | Filter by date, location, type, price | P0 |
| Featured events | Curated spotlight for high-quality events | P1 |
| Search | Full-text search across event names, descriptions | P0 |
| Advanced Filters | Filter by price range, date, location, free/paid, event type | P0 |
| Free Events | Dedicated filter for free events — key for growth & onboarding | P0 |
| Categories | Tags for event types (conference, meetup, party, workshop) | P1 |
| Recommendations | Suggested events based on past attendance | P2 |
| Rich Event Pages | Agenda, speakers, media gallery, venue map, NFT requirements | P0 |

#### Curated Homepage Feed

The homepage features a curated discovery experience with distinct sections:

| Section | Description | Update Frequency |
|---------|-------------|------------------|
| **Featured** | Hand-picked high-quality events from organizers | Manual curation |
| **Trending on Sui** | Events gaining traction in the Sui ecosystem | Real-time |
| **This Week** | Upcoming events within the next 7 days | Daily |
| **Community Picks** | Events voted on or highly rated by attendees | Weekly |

#### Event Submission & Quality Review

| Step | Description |
|------|-------------|
| **1. Organizer Submission** | Organizer submits event details (name, date, venue, description, ticket tiers, royalty %) |
| **2. Editorial Review** | Team reviews for quality — checks event legitimacy, description clarity, pricing fairness |
| **3. Approval & Listing** | Approved events appear on homepage and in search |
| **4. Ongoing Moderation** | Flagged events reviewed, organizers with poor track records restricted |

This ensures the platform maintains **50+ quality events** (MVP goal) rather than spam.

### 4.2 Ticketing System (Free + Paid)

| Feature | Description | Priority |
|---------|-------------|----------|
| Free ticket claims | Zero-cost event registration, NFT minted as proof of attendance | P0 |
| Free event NFTs | Optional NFT claim for proof-of-attendance — collectible, no cost | P0 |
| Paid ticket purchases | SUI payments with transparent fee breakdown before confirmation | P0 |
| Multiple ticket tiers | GA, VIP, Early Bird, etc. per event, each with capacity limits | P0 |
| zkLogin onboarding | Sign in with Google, no wallet setup required — seamless checkout | P0 |
| Wallet connection | Support existing Sui wallets for crypto-native users | P0 |
| Batch minting | Organizers mint 100+ tickets in one transaction | P1 |
| Ticket transfer | Fans transfer tickets to friends with organizer verification | P1 |
| Refund logic | Smart contract handles event cancellation refunds | P1 |
| Digital wallet | View owned tickets, QR codes for instant venue check-in | P0 |
| Gasless transactions | Organizer pays gas for all ticket mints/claims — fans never see gas fees | P0 |

### 4.3 Secondary Marketplace

| Feature | Description | Priority |
|---------|-------------|----------|
| Resale listing | Fans list tickets for resale within smart contract price caps | P0 |
| Automatic royalties | 5-15% of every resale automatically routed to creator/artist | P0 |
| Price cap enforcement | Smart contract rejects listings above organizer-set max price | P0 |
| Sui Kiosk integration | Built-in marketplace with enforcement baked into the protocol | P0 |
| Resale tracking | Organizers see secondary market activity for their events | P1 |

### 4.4 Organizer Tools & Monetization (Freemium Model)

#### Free Tier

| Feature | Description |
|---------|-------------|
| Event creation | Create and list events at no cost |
| List free events | Unlimited free event listings — key for growth |
| Standard ticketing | Free and paid ticket sales |
| Standard analytics | Sales count, basic attendee info |
| QR code check-in | Venue entry scanning |
| Community support | Access to help docs and community |

#### Paid Tier (Pro)

*Monetization: Monthly subscription or revenue share — TBD*

| Feature | Description |
|---------|-------------|
| Advanced analytics & attendee insights | Detailed wallet demographics, resale tracking, audience behavior |
| White-label pages & custom branding | Custom domain, branded event pages, logo placement |
| Priority support | Dedicated support channel |
| Early access to features | Beta access to new tools |
| Reduced platform fees | Lower commission on paid ticket sales |
| Priority curation | Featured placement on homepage and in search results |
| Higher capacity & custom ticket options | Increased batch mint limits, custom ticket tiers, VIP packages |
| Royalty enforcement | Custom royalty percentages on secondary sales |
| Marketing/boost tools | Promote events, boost visibility, email campaigns to past attendees |
| Advanced check-in & access controls | VIP gating, time-based access, multi-zone entry, will-call support |

#### Platform Revenue Model

| Revenue Stream | Description |
|----------------|-------------|
| Premium organizer subscriptions | Monthly/annual Pro tier subscriptions from organizers |
| Transaction fees | Revenue share on paid ticket sales (target 5-8%) |
| Sponsored/featured slots | Paid promoted listings on homepage and in search results |
| Secondary market fees | Small fee on resale transactions |

> **The no-brainer model:** Organizers start free, see results, and upgrade for growth tools. Free events drive adoption, paid features drive revenue.

---

### 4.5 Loyalty & Post-Event

| Feature | Description | Priority |
|---------|-------------|----------|
| Proof-of-Attendance NFTs | On-chain POAP-style NFTs minted after event attendance | P0 |
| Loyalty points | Cross-event points earned per ticket claim/purchase — redeemable for perks, future discounts, merch | P1 |
| Event feedback | Post-event rating and review system | P2 |
| Attendee analytics | Organizers see wallet-based audience insights | P1 |
| Post-event collectibles | Exclusive NFT collectibles for attendees (event-specific art, memories) | P2 |
| Leaderboards | Top attendees, most active collectors, loyalty rankings | P2 |

---

## 5. Non-Functional Requirements

### UX

- Mobile-first responsive design
- Beautiful event imagery and rich media
- Dark mode support
- Smooth animations and transitions
- Accessible (WCAG 2.1 AA)

### Performance

- Gasless where possible (organizer-pays model)
- Sub-second confirmations for venue entry scans
- < 2s page load on 4G
- < 3s ticket purchase confirmation

### Security

- Audited Move smart contracts before mainnet
- Controlled minting (only organizers can mint tickets)
- Input validation on all user-facing inputs
- No hardcoded secrets (.env + .gitignore)
- Rate limiting on public endpoints
- No stack traces in user-facing errors

### Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Sui Move (events, tickets, loyalty) |
| Frontend | Next.js + Tailwind + Shadcn/UI + Mysten dApp Kit |
| Auth | zkLogin |
| Storage | Walrus / IPFS for media |

---

## 6. Inspirations & References

| Platform | What We Take |
|----------|--------------|
| Eventbrite | Event creation UX, organizer dashboard |
| POAP | Proof-of-attendance NFT model |
| Yellowheart | NFT ticketing for live events |
| GET Protocol | Secondary market enforcement |
| Uniswap | Clean, minimal Web3 UX |

### Sui-Specific

| Reference | What We Take |
|-----------|--------------|
| [MystenLabs/ticketing-poc](https://github.com/MystenLabs/ticketing-poc) | Official Sui ticketing proof-of-concept — smart contract patterns |
| [rrapant/suickets](https://github.com/rrapant/suickets) | Sui-based ticketing implementation — reference architecture |
| Sui Kiosk | Built-in secondary marketplace with royalty enforcement |
| zkLogin | Web2 onboarding without wallet friction |
| Sui Framework | Move modules for NFTs, payments, access control |

### UI/UX

> Here's a curated list of high-quality GitHub repositories for UI/UX and Frontend inspiration specifically relevant to Conduit (a modern Web3 events + ticketing platform).
>
> Prioritized repos with clean, modern, responsive designs, Shadcn/UI or Tailwind-heavy stacks, event/ticketing flows, discovery feeds, and Web3 elements.

| Reference | What We Take |
|-----------|--------------|
#### Top Recommendations (Best for Conduit)

| Reference | What We Take |
|-----------|--------------|
| [CoderGhost37/Ticketr](https://github.com/CoderGhost37/Ticketr) | Modern real-time queuing + beautiful shadcn design |
| [saidMounaim/tick-event](https://github.com/saidMounaim/tick-event) | Clean event discovery, ticket buying, dashboard — excellent Shadcn/UI + modern minimal design |
| [heyitsadityaa/ticketr](https://github.com/heyitsadityaa/ticketr) | Bold, real-time event platform with queue system — beautiful Neobrutalist-inspired UI |
| [HiEventsDev/Hi.Events](https://github.com/HiEventsDev/Hi.Events) | Full-featured open-source event platform (very close to Conduit) — strong discovery, organizer tools, checkout UI |
| [cenksari/react-ticketing-website-template](https://github.com/cenksari/react-ticketing-website-template) | Responsive, minimal ticketing template — great event cards and detail pages |
| [Bahaaio/Reservita](https://github.com/Bahaaio/Reservita) | Seat selection, QR tickets, real-time booking — excellent UX flows |
| Eventbrite mobile app | Smooth purchase flow, QR code presentation |
| RainbowKit | Polished wallet connection UX |

#### Additional Strong UI/UX Inspiration Repos

| Repository | What We Take |
|------------|--------------|
| [CoderGhost37/Ticketr](https://github.com/CoderGhost37/Ticketr) | Modern real-time queuing + beautiful shadcn design |
| [jyot103095/SeatFreak](https://github.com/jyot103095/SeatFreak) | Marketplace-style event ticketing inspired by SeatGeek — discovery UX |
| [EliezerKibet/EventTicketingPlatform](https://github.com/EliezerKibet/EventTicketingPlatform) | Professional dashboard-heavy ticketing with analytics UI |
| [BuildMyEvent/BuildMyEvent-Frontend](https://github.com/BuildMyEvent/BuildMyEvent-Frontend) | No-code event page builder with NFT ticketing — customizable event pages |

#### Web3 / Sui-Specific Frontend Examples

| Repository | What We Take |
|------------|--------------|
| [MystenLabs/ticketing-poc](https://github.com/MystenLabs/ticketing-poc) | Official Sui ticketing example — wallet integration and NFT ticket flows |
| [rrapant/suickets](https://github.com/rrapant/suickets) | Full Sui event ticketing dApp with hybrid architecture |

---

## 7. Roadmap

### MVP (Phase 1)

| Deliverable | Description |
|-------------|-------------|
| Smart contracts | Ticket minting, price cap enforcement, royalty distribution |
| Event creation | Organizer can create events with ticket tiers |
| Ticket purchase | Fans can buy/claim tickets with zkLogin |
| Free + Paid event support | Both free and paid ticketing from day one |
| Gasless NFT ticketing | Organizer pays gas — fans never see fees |
| Digital wallet | View tickets, QR codes for venue entry |
| Venue scanner | Organizer can scan QR for check-in |
| Basic loyalty & check-in | POAP-style attendance NFTs, basic points |
| Organizer dashboard | Real-time sales, attendee wallets, event management |
| Curation system | Editorial review process for quality events |

### Phase 2

| Deliverable | Description |
|-------------|-------------|
| Secondary marketplace | Sui Kiosk integration — fans resell within price caps, royalties enforced |
| Loyalty points | Cross-event points system |
| Advanced analytics & personalization | Organizer insights, wallet demographics, personalized event recommendations |
| Batch minting | 100+ tickets in one transaction |
| Premium organizer subscriptions | Pro tier with advanced features |

### Phase 3

| Deliverable | Description |
|-------------|-------------|
| Pro tier | Paid subscriptions for organizers |
| Marketing tools | Boost, featured placement, email campaigns |
| White-label | Custom branding for organizer pages |
| Leaderboards | Top attendees, loyalty rankings |
| Cross-chain elements | Bridge tickets/loyalty to other ecosystems |
| Merch integration | Redeem loyalty points for merch, exclusive NFTs |
| Full community features | DAOs, group tickets, community governance |

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Curation workload | Start small + add community voting later |
| Adoption | Focus on Sui ecosystem partnerships and co-marketing |
| Competition | Differentiate through curation + deep Sui integration |

---

## 9. Objectives & Success Metrics

### 2.1 Primary Objectives

| # | Objective | Why It Matters |
|---|-----------|----------------|
| O1 | **Eliminate ticket fraud** | 12% of all tickets face fraud — NFT ownership on-chain makes counterfeiting impossible |
| O2 | **Stop scalper exploitation** | Smart contract price caps on resale destroy the $15B annual scalping industry |
| O3 | **Return royalties to artists** | 5-15% automatic royalty distribution on every resale — artists profit from secondary markets |
| O4 | **Eliminate hidden fees** | Transparent, auditable fee structure replaces the industry-standard 10-30% hidden fees |
| O5 | **Onboard mainstream users** | zkLogin removes crypto friction — fans sign in with Google, never see blockchain complexity |

### 2.2 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Fraud Rate** | 0% (vs. industry 12%) | On-chain ticket verification logs |
| **Scalping Prevention** | 100% of resale within price caps | Smart contract enforcement logs |
| **Artist Royalty Capture** | 100% of secondary sales route royalties | On-chain royalty payment records |
| **Fee Transparency** | All fees visible before purchase | Fee breakdown shown on every transaction |
| **User Onboarding** | < 60 seconds from landing to ticket purchase | User journey analytics |
| **zkLogin Adoption** | 80%+ of new users use zkLogin | Auth method tracking |
| **Gas Cost to Fan** | $0 (organizer-pays model) | Transaction fee logs |
| **Transaction Finality** | < 3 seconds for venue entry scan | On-chain confirmation times |

### 2.3 User Segments & Goals

| Segment | Primary Goal | Success = |
|---------|--------------|-----------|
| **Event Organizers** | Sell tickets without fraud, track audience, collect data | 0 fraudulent tickets, direct wallet relationships with fans |
| **Artists/Performers** | Earn royalties on resale, protect brand | Automatic royalty payments on every secondary sale |
| **Fans/Attendees** | Buy real tickets at fair prices, easy entry | < 60s purchase flow, instant venue entry confirmation |
| **Secondary Sellers** | Resell within rules | Easy resale listing, automatic royalty split |

### 2.4 Key Results (90-Day Targets)

| Key Result | Target |
|------------|--------|
| KR1 | 10 test events successfully ticketed on testnet |
| KR2 | 100+ tickets minted with < 1% failure rate |
| KR3 | Secondary market resale with royalty enforcement working |
| KR4 | zkLogin onboarding tested with 50+ beta users |
| KR5 | Organizer dashboard showing real-time ticket sales + audience wallets |

---

## 3. Core Features

### 3.1 Smart Contract Layer (Sui Move)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Ticket NFT Minting** | Each ticket is a unique NFT with event metadata, seat info, and price cap | P0 |
| **Price Cap Enforcement** | Smart contract enforces max resale price (set by organizer) | P0 |
| **Automatic Royalty Distribution** | 5-15% royalty routed to artist wallet on every resale | P0 |
| **Sui Kiosk Integration** | Built-in secondary marketplace with enforcement baked in | P0 |
| **Batch Minting** | Organizers can mint 100+ tickets in one transaction | P1 |
| **Ticket Transfer** | Fans can transfer tickets to friends with organizer verification | P1 |
| **Refund Logic** | Smart contract handles event cancellation refunds | P1 |

### 3.2 Frontend — Organizer Experience

| Feature | Description | Priority |
|---------|-------------|----------|
| **Event Creation** | Create event with name, date, venue, pricing, royalty % | P0 |
| **Ticket Dashboard** | Real-time view of sold/available tickets, revenue, audience wallets | P0 |
| **Batch Upload** | CSV/API import for large events | P1 |
| **Analytics** | Audience demographics (wallet-based), sales velocity, resale activity | P2 |

### 3.3 Frontend — Fan Experience

| Feature | Description | Priority |
|---------|-------------|----------|
| **Event Discovery** | Browse/search events | P0 |
| **zkLogin Onboarding** | Sign in with Google — no wallet setup | P0 |
| **One-Click Purchase** | Buy ticket with transparent fee breakdown | P0 |
| **Ticket Wallet** | View owned tickets, QR code for venue entry | P0 |
| **Resale Listing** | List ticket for resale within price cap | P1 |
| **Venue Entry Scanner** | Organizer scans QR → instant on-chain verification | P0 |

### 3.4 Backend Services

| Feature | Description | Priority |
|---------|-------------|----------|
| **Event Indexing** | Index on-chain events for search/browse | P0 |
| **Fee Calculation** | Transparent fee computation before purchase | P0 |
| **Notification System** | Email/push for purchase confirmations, event reminders | P1 |
| **Rate Limiting** | Protect public endpoints from abuse | P0 |

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FAN JOURNEY                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser ──→ Frontend (React/Vite) ──→ zkLogin (Google)     │
│     │                                      │                 │
│     │              ┌───────────────────────┘                 │
│     │              ▼                                         │
│     │        Sui Wallet (managed)                            │
│     │              │                                         │
│     │              ▼                                         │
│     └──→ Buy Ticket ──→ Sui Blockchain                      │
│              │            (Move Smart Contract)              │
│              │                    │                          │
│              ▼                    ▼                          │
│        Ticket NFT minted    Price cap enforced               │
│        in fan's wallet      Royalty locked                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ORGANIZER JOURNEY                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser ──→ Organizer Dashboard ──→ Create Event            │
│     │              │                      │                  │
│     │              │                      ▼                  │
│     │              │              Batch Mint Tickets         │
│     │              │              (Move Contract)            │
│     │              │                      │                  │
│     │              ▼                      ▼                  │
│     │         Real-time View ◄── On-chain Sales Data         │
│     │         (Dashboard)                                    │
│     │                                                        │
│     └──→ Venue Entry Scanner ──→ QR Scan ──→ Verify NFT     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    RESALE FLOW                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Fan lists ticket ──→ Sui Kiosk ──→ Price Cap Checked       │
│                                          │                   │
│                                   ┌──────┴──────┐           │
│                                   ▼              ▼           │
│                             Within Cap    Over Cap → Rejected│
│                                   │                         │
│                                   ▼                         │
│                          New Fan Buys                        │
│                                   │                         │
│                    ┌──────────────┼──────────────┐          │
│                    ▼              ▼              ▼          │
│              Seller Gets    Royalty to      Platform Fee     │
│              (Price - 15%)  Artist (5-15%)  (2-5%)          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Blockchain** | Sui | Sub-cent fees, fast finality (~2.5s), native Kiosk for royalty enforcement, zkLogin for Web2 onboarding |
| **Smart Contracts** | Sui Move | Native NFT support, Kiosk integration, type-safe |
| **Frontend** | React + Vite + Tailwind | Fast iteration, rich ecosystem, AI-friendly |
| **SDK** | @mysten/sui | Official Sui TypeScript SDK |
| **Auth** | zkLogin | No wallet setup — sign in with Google |
| **Database** | Supabase | Event indexing, search, user preferences |
| **Hosting** | Vercel | Frontend deploy, edge functions |
| **Package Manager** | npm | Default for Sui ecosystem |

---

## 6. User Stories

### 6.1 Fan Stories

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| F1 | As a fan, I want to sign in with my Google account so I don't need a crypto wallet | zkLogin flow completes in < 30s, no wallet download required |
| F2 | As a fan, I want to browse events and see transparent pricing | Event list loads, each shows price + fees before purchase |
| F3 | As a fan, I want to buy a ticket in one click | Purchase flow: select event → confirm → ticket in wallet (< 10s) |
| F4 | As a fan, I want to see my tickets with QR codes for venue entry | My Tickets page shows owned tickets with scannable QR |
| F5 | As a fan, I want to resell my ticket at a fair price | Resale listing auto-enforces price cap, royalty deducted |

### 6.2 Organizer Stories

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| O1 | As an organizer, I want to create an event with custom royalty % | Event creation form → smart contract deployed with royalty config |
| O2 | As an organizer, I want to batch mint 100+ tickets in one tx | CSV upload → batch mint → all tickets appear in Kiosk |
| O3 | As an organizer, I want to see real-time sales and audience wallets | Dashboard updates every block, shows wallet addresses |
| O4 | As an organizer, I want to scan QR codes at venue entry for instant verification | Scanner verifies NFT ownership on-chain in < 2.5s |
| O5 | As an organizer, I want to cancel an event and auto-refund fans | Cancel event → smart contract refunds all ticket holders |

### 6.3 Artist Stories

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| A1 | As an artist, I want automatic royalties on every resale | Royalty % enforced by smart contract, paid to artist wallet |
| A2 | As an artist, I want to see my royalty earnings dashboard | Dashboard shows total royalties earned per event |

---

## 7. Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| **Performance** | Frontend load time | < 2s on 4G |
| **Performance** | Ticket purchase confirmation | < 3s (Sui finality) |
| **Performance** | Venue entry scan verification | < 2.5s |
| **Security** | Smart contract audit | Before mainnet |
| **Security** | No hardcoded secrets | .env + .gitignore |
| **Security** | Input validation | All user-facing inputs |
| **Security** | Rate limiting | Public API endpoints |
| **Reliability** | Uptime | 99.9% |
| **Reliability** | Ticket mint success rate | 99%+ |
| **Usability** | Onboarding completion | < 60s |
| **Usability** | Purchase flow steps | Max 3 clicks |
| **Accessibility** | WCAG 2.1 AA | All user-facing pages |
| **Mobile** | Responsive design | All screen sizes |

---

## 8. Constraints & Assumptions

### 8.1 Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| Sui testnet only (Phase 1) | No real money at stake | Full feature testing on testnet |
| zkLogin requires Google account | Excludes non-Google users | Future: add Apple, email options |
| Smart contract gas paid by organizer | Organizer bears all gas costs | Sui sub-cent fees make this viable |
| No fiat on-ramp (Phase 1) | Fans need SUI tokens | Testnet faucet for testing |

### 8.2 Assumptions

1. Sui network remains stable and maintains sub-cent fees
2. zkLogin continues to be supported and maintained by Mysten Labs
3. Sui Kiosk provides sufficient secondary market functionality
4. Event organizers are willing to pay gas for their fans
5. Fans prefer Google sign-in over crypto wallet management

---

## 9. Milestones & Timeline

| Phase | Milestone | Target Date | Deliverable |
|-------|-----------|-------------|-------------|
| **Phase 1** | Smart Contract MVP | Week 1-2 | Ticket minting, price cap, royalty enforcement |
| **Phase 2** | Frontend Scaffold | Week 2-3 | Organizer dashboard, fan purchase flow |
| **Phase 3** | zkLogin Integration | Week 3 | Google sign-in, managed wallet |
| **Phase 4** | Sui Kiosk Integration | Week 3-4 | Secondary marketplace, resale with royalties |
| **Phase 5** | Venue Entry Scanner | Week 4 | QR scan → on-chain verification |
| **Phase 6** | Polish & Testing | Week 5 | End-to-end testing, bug fixes, documentation |
| **Phase 7** | Testnet Launch | Week 6 | Public testnet deployment, beta user testing |

---

## 10. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | What fee structure for the platform (2-5% TBD)? | Product | Open |
| 2 | Should organizers set royalty % or is it fixed? | Product | Open |
| 3 | How to handle event cancellations and disputes? | Product | Open |
| 4 | Do we need a centralized event indexer or fully on-chain? | Engineering | Open |
| 5 | What's the max batch mint size per transaction? | Engineering | Open |
| 6 | Do we support multiple ticket types (GA, VIP, etc.) per event? | Product | Open |

---

*This PRD is a living document. Updates will be made as the project progresses.*
