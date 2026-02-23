# Scentree Development Guide

Complete guide for developing and extending the Scentree AI trading platform.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [API Integration](#api-integration)
6. [Database Management](#database-management)
7. [Testing & Debugging](#testing--debugging)
8. [Deployment](#deployment)

---

## Project Overview

**Scentree** is a Solana-native trading assistant that combines:
- **AI Intent Analysis** (xAI Grok)
- **Risk Assessment** (Multi-factor scoring)
- **Anti-Rug Detection** (Liquidity analysis)
- **Smart Routing** (Jupiter DEX)

### Key Principles

1. **Risk-First**: All trades evaluated for risk before execution
2. **User Control**: Human approval required for all transactions
3. **Transparency**: Complete audit trail of decisions
4. **Privacy**: Keys never leave the browser

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                      │
│  ┌──────────────────────────────────────────────┐   │
│  │         Next.js Frontend (Port 3000)         │   │
│  │  ┌─────────────┐  ┌──────────────────────┐  │   │
│  │  │  React UI   │  │  Solana Wallet API   │  │   │
│  │  │  Components │  │  (@solana/web3.js)   │  │   │
│  │  └─────────────┘  └──────────────────────┘  │   │
│  │         ↓                 ↓                   │   │
│  │     HTTP Requests    Wallet Sign             │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         ↓ HTTP REST API (Port 3001) ↓
┌─────────────────────────────────────────────────────┐
│          Fastify Backend Server                      │
│  ┌──────────────────────────────────────────────┐   │
│  │        Route Controllers                     │   │
│  │  ├─ /api/analyze-intent                     │   │
│  │  ├─ /api/scan-token/:mint                   │   │
│  │  ├─ /api/risk-profile/:wallet                │   │
│  │  └─ /api/trade-history/:wallet               │   │
│  └──────────────────────────────────────────────┘   │
│                      ↓                               │
│  ┌──────────────────────────────────────────────┐   │
│  │         Business Logic Services              │   │
│  │  ├─ AIService (xAI Grok)                    │   │
│  │  ├─ RiskService (Token analysis)            │   │
│  │  ├─ SolanaService (RPC calls)               │   │
│  │  └─ JupiterService (Swap routing)           │   │
│  └──────────────────────────────────────────────┘   │
│                      ↓                               │
│  ┌──────────────────────────────────────────────┐   │
│  │       PostgreSQL Database (Prisma ORM)       │   │
│  │  ├─ Users                                    │   │
│  │  ├─ RiskProfiles                            │   │
│  │  ├─ TokenRisk Cache                         │   │
│  │  ├─ TradeHistory                            │   │
│  │  ├─ AIDecisions                             │   │
│  │  └─ Settings                                │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         ↓ External APIs ↓
┌────────────────────────┬─────────────────────────────┐
│  Blockchain APIs       │  External Services          │
│  ├─ Solana RPC         │  ├─ xAI Grok               │
│  ├─ Helius (metadata)  │  ├─ Jupiter DEX            │
│  └─ PublicKey parsing  │  └─ Token metadata         │
└────────────────────────┴─────────────────────────────┘
```

### Data Flow

**User Analysis Request**:
```
1. User clicks "Analyze Portfolio" in UI
2. Frontend calls useAPI.analyzeIntent()
3. HTTP POST to /api/analyze-intent with wallet address
4. Backend AIService calls xAI Grok API
5. Response includes sentiment, confidence, action
6. Backend logs decision to Prisma
7. Frontend displays recommendation with risk score
```

**Token Scan Request**:
```
1. User hovers over/clicks token in portfolio
2. Frontend calls useAPI.scanToken(mint)
3. HTTP GET to /api/scan-token/:mint
4. RiskService checks Helius for liquidity/authority
5. Result cached in TokenRisk table
6. Response includes rugRiskScore (0-100), riskLevel
7. UI displays warning indicator
```

---

## Frontend Development

### Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Main dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── PortfolioCard.tsx  # SOL + token display
│   │   ├── RiskScore.tsx      # Risk visualization
│   │   ├── AIAnalysis.tsx     # AI recommendations
│   │   ├── blur.tsx           # Blur background
│   │   └── providers/
│   │       └── SolanaProvider.tsx  # Wallet adapter setup
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── usePortfolio.ts   # Fetch wallet data
│   │   ├── useRiskAssessment.ts # Calculate risk score
│   │   ├── useAPI.ts         # Backend API calls
│   │   └── ...
│   │
│   └── lib/
│       └── solana/
│           └── utils.ts       # Solana helper functions
│
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

### Key Components

#### PortfolioCard.tsx

Displays wallet balance and token holdings.

```typescript
interface PortfolioCardProps {
  loading?: boolean;
  error?: string;
}

// Shows:
// - SOL balance in USD
// - Token holdings with prices
// - Total portfolio value
// - Loading/empty states
```

#### RiskScore.tsx

Visualizes portfolio risk level.

```typescript
interface RiskScoreProps {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  factors: string[];
  confidence: number; // 0-100
}

// Colors:
// - Low (0-25): Green
// - Medium (25-50): Yellow
// - High (50-75): Orange
// - Critical (75-100): Red
```

#### AIAnalysis.tsx

Displays AI recommendations.

```typescript
interface AIAnalysisProps {
  sentiment: 'bullish' | 'neutral' | 'bearish';
  confidence: number; // 0-100
  recommendation: string;
  keyPoints: string[];
}

// Shows:
// - Sentiment with confidence bar
// - Recommendation text
// - Key supporting points
// - Risk disclaimer
```

### Custom Hooks

#### usePortfolio.ts

Fetch wallet balance and tokens.

```typescript
const { balance, tokens, loading, error, refresh } = usePortfolio();

// balance: number (in SOL)
// tokens: Array<{
//   mint: string;
//   amount: number;
//   decimals: number;
//   symbol: string;
//   price: number;
// }>
```

#### useRiskAssessment.ts

Calculate risk score from portfolio.

```typescript
const { riskScore, riskLevel, factors, confidence } = useRiskAssessment(tokens);

// Risk factors:
// - Token count diversification
// - Single token concentration
// - SOL concentration
// - Token age/trust score
```

#### useAPI.ts

Backend API client.

```typescript
const api = useAPI();

// Available methods:
await api.analyzeIntent(walletAddress);
await api.scanToken(mint);
await api.getRiskProfile(walletAddress);
await api.updateRiskProfile(walletAddress, settings);
await api.getTradeHistory(walletAddress);
```

### Styling

Uses **Tailwind CSS** with custom configuration:

```tailwind
/* Colors */
@apply bg-slate-950       /* Dark background */
@apply text-white         /* Primary text */
@apply border-slate-800   /* Borders */

/* Risk levels */
@apply text-green-400     /* Low risk */
@apply text-yellow-400    /* Medium risk */
@apply text-orange-400    /* High risk */
@apply text-red-400       /* Critical risk */
```

### State Management

**Local State**:
```typescript
const [portfolio, setPortfolio] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Context (Wallet)**:
```typescript
const { publicKey, connected, signTransaction } = useWallet();
```

**Future**: Consider Zustand or Jotai for complex state.

---

## Backend Development

### Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Server entry
│   │
│   ├── controllers/
│   │   └── api.controller.ts   # Route handlers
│   │
│   ├── services/
│   │   ├── ai.service.ts       # xAI Grok integration
│   │   ├── risk.service.ts     # Token risk analysis
│   │   ├── solana.service.ts   # Solana RPC calls
│   │   └── jupiter.service.ts  # DEX routing
│   │
│   └── types.ts                 # TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma           # Database models
│   └── migrations/             # DB migrations
│
├── dist/                        # Compiled output
├── package.json
├── tsconfig.json
└── .env                         # Configuration
```

### Server Setup (index.ts)

```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Register CORS
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});

// Decorate request with services
fastify.decorate('prisma', prisma);

// Define routes in controllers
// Health check endpoint
fastify.get('/health', async () => ({ status: 'ok' }));

// Start server
await fastify.listen({ port: 3001, host: '0.0.0.0' });
```

### Service Architecture

#### AIService

Analyzes user intent and provides recommendations.

```typescript
class AIService {
  async analyzePortfolio(walletAddress: string, tokens: Token[]) {
    // 1. Format portfolio summary
    // 2. Call xAI Grok API
    // 3. Parse response
    // 4. Return structured result
    
    return {
      suggestion: string;        // Recommendation
      confidence: number;        // 0-1
      riskRating: number;        // 1-100
      reasoning: string;
    };
  }
}

// Used by: POST /api/analyze-intent
```

#### RiskService

Scans tokens for rug-pull risk.

```typescript
class RiskService {
  async scanToken(mint: string) {
    // 1. Check liquidity locks (Helius)
    // 2. Analyze mint authority
    // 3. Calculate holder concentration
    // 4. Score rug-pull risk
    
    return {
      rugRiskScore: number;        // 0-100
      riskLevel: 'Safe' | 'Caution' | 'HighRisk';
      liquidity: number;           // USD
      mintAuthority: string | null;
      topHolderPercent: number;
      explanation: string;
    };
  }
}

// Used by: GET /api/scan-token/:mint
```

#### SolanaService

Direct blockchain interactions.

```typescript
class SolanaService {
  async getWalletBalance(address: string): Promise<number> {
    // Returns SOL balance
  }

  async getTokenAccounts(address: string) {
    // Returns array of token accounts with balances
  }

  async getTokenMetadata(mint: string) {
    // Returns token name, symbol, decimals, logo
  }

  async getTokenPrice(mint: string): Promise<number> {
    // Returns current price in USD
  }
}

// Used by: All services that need blockchain data
```

#### JupiterService

DEX routing and swap execution.

```typescript
class JupiterService {
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ) {
    // Returns best swap route with quotes
    
    return {
      routePlan: Array<{
        swapInfo: {
          ammKey: string;
          label: string;
          inputMint: string;
          outputMint: string;
          inAmount: string;
          outAmount: string;
        };
      }>;
      priceImpactPct: string;
      outputAmount: string;
      minOutputAmount: string;
    };
  }

  async getSwapTransaction(
    walletAddress: string,
    route: any
  ) {
    // Returns transaction to sign for swap
  }

  async simulateSwap(transaction: any) {
    // Dry-run swap to verify it will succeed
  }
}

// Used by: POST /api/execute-swap (future)
```

### Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  address   String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  riskProfile RiskProfile?
  decisions   AIDecision[]
  trades      TradeLog[]
}

model RiskProfile {
  id           String @id @default(cuid())
  userId       String @unique
  riskLevel    Int    @default(50)  // 1-100
  maxAllocPct  Float  @default(0.1) // 10% max per trade
  stopLossPct  Float  @default(10)
  
  user User @relation(fields: [userId], references: [id])
}

model TokenRisk {
  id          String @id @default(cuid())
  mint        String @unique
  rugRiskScore Int   @default(0)     // 0-100
  riskLevel   String @default("Safe")
  liquidity   Float
  updatedAt   DateTime @updatedAt
}

model AIDecision {
  id        String   @id @default(cuid())
  userId    String
  input     String   // User's intent/action
  output    String   // AI's recommendation
  confidence Float
  timestamp DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}

model TradeLog {
  id        String   @id @default(cuid())
  userId    String
  fromToken String
  toToken   String
  amount    Float
  price     Float
  riskScore Int
  status    String  // Pending, Success, Failed
  timestamp DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}

model Settings {
  id String @id @default(cuid())
  key String @unique
  value String
}
```

### API Endpoints

#### POST /api/analyze-intent

Analyze portfolio and get AI recommendation.

```typescript
// Request
POST /api/analyze-intent
{
  "walletAddress": "9P3t..."
}

// Response (200)
{
  "suggestion": "Rebalance COPE position",
  "confidence": 0.89,
  "riskRating": 62,
  "reasoning": "COPE is 45% of portfolio..."
}

// Error (400, 500)
{
  "error": "Missing walletAddress"
}
```

#### GET /api/scan-token/:mint

Scan token for rug-pull risk.

```typescript
// Request
GET /api/scan-token/EPjFWaLb3odccccccccPb8d5...

// Response (200)
{
  "rugRiskScore": 23,
  "riskLevel": "Safe",
  "liquidity": 125000,
  "mintAuthority": null,
  "topHolderPercent": 8.2,
  "explanation": "Token has sufficient liquidity..."
}
```

#### GET /api/risk-profile/:walletAddress

Get user's risk settings.

```typescript
// Response (200)
{
  "riskLevel": 65,
  "maxAllocPct": 0.1,
  "stopLossPct": 10
}
```

#### PUT /api/risk-profile/:walletAddress

Update user's risk settings.

```typescript
// Request
{
  "riskLevel": 75,
  "maxAllocPct": 0.15,
  "stopLossPct": 8
}

// Response (200)
{ "updated": true }
```

#### GET /api/trade-history/:walletAddress

Get user's trade history.

```typescript
// Response (200)
[
  {
    "id": "tx_123",
    "fromToken": "SOL",
    "toToken": "COPE",
    "amount": 10,
    "price": 15.23,
    "riskScore": 45,
    "status": "Success",
    "timestamp": "2025-03-15T10:30:00Z"
  }
]
```

### Error Handling

```typescript
// 400 Bad Request
{ "error": "Missing required parameter: mint" }

// 404 Not Found
{ "error": "User not found" }

// 500 Internal Server Error
{ "error": "AI service unavailable" }
```

---

## API Integration

### xAI Grok Setup

1. Get API key from [xAI console](https://console.x.ai)
2. Add to `backend/.env`:
   ```env
   XAI_GROK_API_KEY=xai-...
   ```
3. Service automatically formats portfolio context
4. Mock fallback if API fails (dev mode)

### Helius Setup

1. Create account at [helius.xyz](https://www.helius.xyz)
2. Get API key from dashboard
3. Add to `backend/.env`:
   ```env
   HELIUS_API_KEY=your_key_here
   ```
4. RiskService uses for token metadata and authority checks

### Jupiter Setup

1. No API key required for quotes
2. Configure RPC endpoint in `backend/.env`:
   ```env
   JUPITER_API_URL=https://quote-api.jup.ag/v6
   SOLANA_RPC_URL=https://api.devnet.solana.com
   ```
3. Service handles route fetching and validation

---

## Database Management

### Local PostgreSQL Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Linux
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database
createdb scentree
```

### Prisma Migrations

```bash
cd backend

# Create migration after schema change
npx prisma migrate dev --name add_feature_name

# Apply existing migrations
npx prisma migrate deploy

# Reset database (dev only!)
npx prisma migrate reset

# View database GUI
npx prisma studio
```

### Database Queries

```typescript
// In your service
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: { address: '9B5...' }
});

// Read
const user = await prisma.user.findUnique({
  where: { address: '9B5...' }
});

// Update
await prisma.riskProfile.update({
  where: { userId },
  data: { riskLevel: 75 }
});

// Delete
await prisma.user.delete({
  where: { id: 'user_123' }
});
```

---

## Testing & Debugging

### Frontend Debugging

```bash
# Start with verbose logging
cd frontend
NEXT_DEBUG=* npm run dev

# Chrome DevTools
# - Open http://localhost:3000
# - F12 → Console/Sources/Network tabs
# - Check wallet connection in console:
//   wallet.publicKey
```

### Backend Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server health
curl http://localhost:3001/health

# Test API endpoint
curl -X GET http://localhost:3001/api/scan-token/EPjFWaLb3odccccccccPb8d5...

# View Fastify logs
# - Server starts on port 3001
# - All requests logged with timing
```

### Common Issues

**Issue**: "Connection refused" from frontend to backend
```
Solution: 
- Check backend running on :3001
- Verify NEXT_PUBLIC_API_URL in frontend/.env.local
- Check CORS origin in backend/src/index.ts
```

**Issue**: Wallet not connecting
```
Solution:
- Verify Phantom/Solflare installed
- Check network is Devnet
- Clear browser cache
- Ensure SolanaProvider wraps layout
```

**Issue**: Database connection error
```
Solution:
- Check PostgreSQL running: psql postgres
- Verify DATABASE_URL in backend/.env
- Run migrations: npx prisma migrate deploy
```

---

## Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd backend
npm run build
NODE_ENV=production node dist/index.js
```

### Vercel (Frontend)

```bash
# Deploy Next.js frontend
vercel deploy --prod

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.scentree.app
```

### Railway/Fly.io (Backend)

```bash
# Deploy Fastify backend
fly deploy

# Set secrets
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set XAI_GROK_API_KEY="..."
```

### Environment Configuration

```env
# Production
NODE_ENV=production
DATABASE_URL=postgresql://prod-server:5432/scentree_prod
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Or custom endpoint
XAI_GROK_API_KEY=xai-prod-key
HELIUS_API_KEY=prod-helius-key

# Limits
MAX_ALLOCATION=0.05        # 5% per trade
DAILY_TRADE_LIMIT=10
DEFAULT_STOP_LOSS=8.0
```

---

## Next Steps

1. **Phase 3**: Build manual trading UI with Jupiter integration
2. **Phase 4**: Implement guarded auto-trading with vault system
3. **Mainnet**: Deploy to Solana mainnet with security audit
4. **Mobile**: Build mobile app with React Native

For questions or issues, check [GitHub Issues](https://github.com/yourusername/scentree/issues).
