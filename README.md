# Conduit 🎫

**The Curated Web3 Events Hub on Sui**

Conduit is an event ticketing platform built on the Sui blockchain that replaces broken ticketing infrastructure with NFT-based tickets. It enforces anti-scalping rules, guarantees zero counterfeits, and routes royalties to artists automatically.

## Features

- 🎫 **NFT Tickets** — Unique on-chain ownership, zero counterfeits
- 💰 **Price Caps** — Smart contract enforced resale limits
- 🎨 **Royalties** — 5-15% automatic royalty distribution on every resale
- 🔐 **zkLogin** — Sign in with Google, no wallet setup required
- ⚡ **Gasless** — Organizers pay gas, fans never see blockchain
- 📱 **Mobile-First** — Beautiful, responsive design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Sui (Move) |
| Smart Contracts | `conduit_core` |
| Frontend | Next.js 15 + Tailwind + Shadcn/UI |
| Auth | zkLogin + Mysten dApp Kit |
| Storage | IPFS/Walrus (planned) |

## Project Structure

```
conduit/
├── contracts/
│   └── conduit_core/        # Sui Move smart contracts
│       ├── sources/
│       │   └── conduit_core.move
│       └── tests/
│           └── conduit_core_tests.move
├── frontend/                # Next.js web application
│   ├── src/
│   │   ├── app/            # Pages & routes
│   │   ├── components/     # UI components
│   │   └── lib/            # Utilities & config
│   └── package.json
└── docs/
    └── PRD.md              # Product Requirements Document
```

## Getting Started

### Prerequisites

- [Sui CLI](https://docs.sui.io/build/install)
- Node.js 18+
- npm or yarn

### Smart Contracts

```bash
cd contracts/conduit_core

# Build
sui move build

# Test
sui move test

# Deploy (testnet)
sui client publish --gas-budget 100000000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your contract address

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Smart Contract Features

### `conduit_core` Module

| Function | Description |
|----------|-------------|
| `register_organizer` | Register as an event organizer |
| `create_event` | Create a new event with ticket tiers |
| `claim_free_ticket` | Claim a free ticket (NFT mint) |
| `purchase_ticket` | Purchase a paid ticket |
| `list_for_resale` | List ticket on Sui Kiosk marketplace |
| `buy_from_resale` | Buy from secondary market with royalties |
| `check_in_ticket` | Organizer check-in at venue |

## Architecture

```
┌─────────────────────────────────────────────┐
│              FAN JOURNEY                     │
├─────────────────────────────────────────────┤
│  Browser → Frontend → zkLogin (Google)      │
│     │                      │                │
│     │              Sui Wallet (managed)     │
│     │                      │                │
│     └──→ Buy Ticket ──→ Sui Blockchain      │
│              │            (Move Contract)    │
│              ▼                              │
│        Ticket NFT minted                    │
│        Price cap enforced                   │
│        Royalty locked                       │
└─────────────────────────────────────────────┘
```

## Roadmap

### Phase 1 (MVP) ✅
- [x] Smart contracts (ticketing, royalties)
- [x] Frontend scaffold
- [ ] zkLogin integration
- [ ] Event creation flow
- [ ] Ticket purchase flow
- [ ] My Tickets page

### Phase 2
- [ ] Sui Kiosk integration (secondary market)
- [ ] Organizer dashboard
- [ ] Venue entry scanner (QR)
- [ ] Real-time analytics

### Phase 3
- [ ] Loyalty points system
- [ ] Advanced analytics
- [ ] White-label pages
- [ ] Marketing tools

## Contributing

Contributions welcome! Please read our contributing guidelines first.

## License

MIT