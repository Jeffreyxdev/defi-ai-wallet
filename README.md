# Scentree AI - Solana Risk-First Trading Assistant

A comprehensive AI-powered Solana wallet management and trading platform with built-in risk assessment and anti-rug protection.

## 🚀 Features

### Phase 1: Wallet Connect + Portfolio View ✅
- **Solana Wallet Integration**: Support for Phantom and Solflare wallets
- **Portfolio Dashboard**: Real-time SOL and token balance tracking
- **Risk Scoring**: Dynamic risk assessment based on portfolio composition
- **AI Analysis UI**: Visual risk level indicators and recommendations

### Phase 2: AI Intent Engine ✅
- **xAI Grok Integration**: Natural language intent analysis
- **Smart Suggestions**: AI-powered trading recommendations
- **Confidence Scoring**: ML-based confidence metrics for each decision
- **Decision Logging**: Complete audit trail of all AI decisions

### Phase 3: Manual Trading + Anti-Rug (In Progress)
- **Token Risk Scanning**: Liquidity lock detection, mint authority checks
- **Risk Warnings**: Interactive warnings before trades
- **Jupiter API Integration**: Best route discovery for swaps
- **Slippage Protection**: Configurable slippage tolerance

### Phase 4: Guarded Auto-Trading (Planned)
- **Strict Guardrails**: Stop-loss enforcement and max allocation limits
- **Secure Vault**: Encrypted private key management
- **Trade Execution**: Atomic swap execution with rollback
- **Rate Limiting**: Daily trade limits and cooldown periods

## 📦 Project Structure

```
scentree/
├── frontend/              # Next.js 16 frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
│   └── package.json
├── backend/              # Fastify + Prisma backend
│   ├── src/
│   │   ├── controllers/  # API route handlers
│   │   ├── services/     # Business logic
│   │   └── index.ts      # Server entry
│   ├── prisma/          # Database schema
│   └── package.json
└── README.md
```

## 🔧 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+
- Git

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd scentree
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/scentree"
PORT=3001
SOLANA_RPC_URL="https://api.devnet.solana.com"
HELIUS_API_KEY="your_helius_key"
JUPITER_API_URL="https://quote-api.jup.ag/v6"
XAI_GROK_API_KEY="your_xai_key"
```

### 3. Setup Database

```bash
cd backend

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Access the app at `http://localhost:3000`

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **State**: React Hooks + Context API
- **Wallet**: @solana/wallet-adapter-react
- **Icons**: lucide-react

### Backend Stack
- **Server**: Fastify 5
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: @solana/web3.js
- **APIs**: Helius, Jupiter, xAI Grok

## 🔐 Security Considerations

1. **Wallet Security**: Keys never leave the user's browser
2. **API Security**: CORS configured, rate limiting enabled
3. **Transaction Signing**: All trades require user confirmation
4. **Risk Assessment**: Smart contract analysis before trades
5. **Audit Trail**: Complete logging of all decisions

## 📊 API Endpoints

### AI Analysis
- `POST /api/analyze-intent` - Get AI recommendations
- `GET /api/risk-profile/:walletAddress` - Fetch user risk profile
- `PUT /api/risk-profile/:walletAddress` - Update risk settings

### Risk Assessment
- `GET /api/scan-token/:mint` - Analyze token for rug risk
- `GET /api/trade-history/:walletAddress` - Get trading history

## 🧪 Testing

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Type checking
cd backend && npm run build
```

## 📝 Development Workflow

1. **Create feature branch**: `git checkout -b feature/name`
2. **Make changes** in frontend or backend
3. **Test locally** with dev servers running
4. **Build for production**: `npm run build`
5. **Submit PR** with clear description

## 🚨 Common Issues

### Database Connection Error
- Check PostgreSQL is running: `psql postgres`
- Verify DATABASE_URL in `.env`
- Run migrations: `npx prisma migrate deploy`

### Module Not Found Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Regenerate Prisma: `npx prisma generate`

### CORS Errors
- Ensure NEXT_PUBLIC_API_URL matches backend URL
- Check backend CORS configuration in `src/index.ts`

## 📚 Documentation

- [Frontend Guide](./frontend/README.md)
- [Backend Guide](./backend/README.md)
- [API Reference](./API.md)

## 🤝 Contributing

Contributions welcome! Please:
1. Follow TypeScript strict mode
2. Add tests for new features
3. Update documentation
4. Use conventional commit messages

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

- [ ] Phase 3: Manual trading + anti-rug (March 2026)
- [ ] Phase 4: Guarded auto-trading (April 2026)
- [ ] Mainnet support
- [ ] Mobile app
- [ ] Community features

## 🔗 Links

- [Solana Docs](https://docs.solana.com)
- [Jupiter Docs](https://docs.jup.ag)
- [Helius Docs](https://docs.helius.xyz)
- [Fastify Docs](https://www.fastify.io)

---

Built with ❤️ for Solana traders
