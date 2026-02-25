# Scentree Documentation Index

Welcome to Scentree! This is your complete guide to the AI-powered Solana trading assistant.

---

##  Documentation Files

### Getting Started
1. **[README.md](README.md)** - Start here!
   - Project overview
   - Features summary
   - Setup instructions
   - Architecture overview
   - Common issues and solutions
   - Links to key resources

2. **[quick-start.sh](quick-start.sh)** - Automated setup
   - Installs all dependencies
   - Creates environment files
   - Verifies builds
   - Takes ~5 minutes

### For Developers

3. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Complete development guide
   - Project structure
   - Architecture diagrams
   - Frontend development guide
   - Backend development guide
   - API integration instructions
   - Database management
   - Testing and debugging
   - Deployment strategies

4. **[API.md](API.md)** - API reference
   - All 6 endpoints fully documented
   - Request/response examples
   - Error codes and handling
   - Use case examples
   - Rate limiting information
   - Future endpoints planned

### Project Management

5. **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Status tracking
   - Completion summary (Phase 1 & 2 complete)
   - Priority task list
   - Architecture reference
   - Known issues (none)
   - Success criteria
   - Development velocity

6. **[SUMMARY.md](SUMMARY.md)** - Implementation overview
   - What was built
   - Project statistics
   - Technology stack
   - Verification checklist
   - How to use
   - Next steps
   - Troubleshooting

---

##  Quick Start

### Option 1: Automated Setup (Recommended)
```bash
cd scentree
./quick-start.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Configure environment files
# See README.md for details

# Start servers in separate terminals
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# Visit http://localhost:3000
```

---

##  Reading Order

**For New Team Members**:
1. Read [README.md](README.md) - Overview
2. Run [quick-start.sh](quick-start.sh) - Setup
3. Read [SUMMARY.md](SUMMARY.md) - What was built
4. Read [DEVELOPMENT.md](DEVELOPMENT.md) - Architecture

**For Backend Developers**:
1. [DEVELOPMENT.md](DEVELOPMENT.md#backend-development) - Backend section
2. [API.md](API.md) - API reference
3. [backend/src](backend/src) - Source code

**For Frontend Developers**:
1. [DEVELOPMENT.md](DEVELOPMENT.md#frontend-development) - Frontend section
2. [frontend/src](frontend/src) - Source code
3. [API.md](API.md) - Integration examples

**For DevOps/Infrastructure**:
1. [DEVELOPMENT.md](DEVELOPMENT.md#deployment) - Deployment section
2. [PROJECT_STATUS.md](PROJECT_STATUS.md#next-priority-tasks) - Setup tasks

---

##  Project Structure

```
scentree/
├──  Documentation
│   ├── README.md            ← Project overview
│   ├── DEVELOPMENT.md       ← Developer guide
│   ├── API.md               ← API reference
│   ├── PROJECT_STATUS.md    ← Status tracking
│   ├── SUMMARY.md           ← Implementation summary
│   └── INDEX.md (this file)
│
├── Frontend (Next.js)
│   ├── src/app/            # Pages and layouts
│   ├── src/components/     # React components
│   ├── src/hooks/          # Custom hooks
│   └── src/lib/            # Utilities
│
└──  Backend (Fastify)
    ├── src/index.ts        # Server entry
    ├── src/controllers/    # API routes
    ├── src/services/       # Business logic
    └── prisma/             # Database schema
```

---

##  Project Status

### Completed Phases
- **Phase 1**: Wallet Connect + Portfolio View
-  **Phase 2**: AI Intent Engine

### In Progress
-  **Phase 3**: Manual Trading + Anti-Rug

### Planned
-  **Phase 4**: Guarded Auto-Trading

### Build Status
-  Frontend: Compiles successfully
-  Backend: TypeScript validation passing
-  Database: Ready for migration

---

##  Key Features

### Phase 1 & 2 (Complete)
-  Solana wallet connection
-  Real-time portfolio display
-  AI-powered analysis (xAI Grok)
-  Risk scoring (0-100)
-  Decision logging

### Phase 3 (In Progress)
-  Token risk scanning
-  Anti-rug detection
-  Manual trading UI
-  Jupiter DEX integration

### Phase 4 (Planned)
-  Auto-trading engine
-  Secure vault system
-  Guardrail enforcement
-  Rate limiting

---

##  Important Links

### Documentation
- [Development Guide](DEVELOPMENT.md)
- [API Reference](API.md)
- [Project Status](PROJECT_STATUS.md)
- [Implementation Summary](SUMMARY.md)

### Technologies
- [Solana Docs](https://docs.solana.com)
- [Next.js Docs](https://nextjs.org)
- [Fastify Docs](https://www.fastify.io)
- [Prisma Docs](https://www.prisma.io)
- [Jupiter Docs](https://docs.jup.ag)
- [Helius Docs](https://docs.helius.xyz)

### External APIs
- [xAI Grok](https://x.ai)
- [Jupiter DEX](https://jup.ag)
- [Helius](https://www.helius.xyz)

---

##  Development Commands

### Frontend
```bash
cd frontend

# Development
npm run dev          # Start dev server on :3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code quality
npm run lint         # Run ESLint
```

### Backend
```bash
cd backend

# Development
npm run dev          # Start dev server on :3001

# Production
npm run build        # Build TypeScript
npm start            # Run built app

# Database
npx prisma migrate dev --name <name>  # Create migration
npx prisma migrate deploy              # Apply migrations
npx prisma studio                      # Open Prisma Studio
```

---

##  Troubleshooting

### Issue: "Port already in use"
```bash
# Kill process on port 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port
PORT=3002 npm run dev  # Backend
```

### Issue: "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Database connection error"
```bash
# Verify PostgreSQL is running
psql postgres

# Check DATABASE_URL in backend/.env
echo $DATABASE_URL
```

**For more troubleshooting, see [SUMMARY.md#troubleshooting](SUMMARY.md#troubleshooting)**

---

## 📋 Checklist for New Developers

- [ ] Read [README.md](README.md)
- [ ] Run [quick-start.sh](quick-start.sh)
- [ ] Verify both servers start (`npm run dev`)
- [ ] Visit http://localhost:3000 in browser
- [ ] Review [DEVELOPMENT.md](DEVELOPMENT.md)
- [ ] Understand API from [API.md](API.md)
- [ ] Check [PROJECT_STATUS.md](PROJECT_STATUS.md) for next tasks

---

##  Learning Path

### Beginner
1. [README.md](README.md) - Overview
2. Setup with [quick-start.sh](quick-start.sh)
3. Explore [frontend/src/app/page.tsx](frontend/src/app/page.tsx)

### Intermediate
1. Read [DEVELOPMENT.md](DEVELOPMENT.md)
2. Explore service layer ([backend/src/services](backend/src/services))
3. Study API endpoints ([API.md](API.md))

### Advanced
1. Review architecture diagrams in [DEVELOPMENT.md](DEVELOPMENT.md)
2. Examine database schema ([backend/prisma/schema.prisma](backend/prisma/schema.prisma))
3. Study error handling and edge cases

---

##  Next Steps

### Immediate Priority
1. **Setup Database**: Run `npx prisma migrate deploy`
2. **Complete Helius Integration**: Enhance [backend/src/services/risk.service.ts](backend/src/services/risk.service.ts)
3. **Add Jupiter Endpoint**: Wire swap endpoint in [backend/src/controllers/api.controller.ts](backend/src/controllers/api.controller.ts)

### Short-term Goals
1. Build manual trading UI components
2. Implement trade confirmation modal
3. Test end-to-end trading flow

### See [PROJECT_STATUS.md](PROJECT_STATUS.md) for full roadmap

---

##  Getting Help

**Documentation**:
- [DEVELOPMENT.md](DEVELOPMENT.md) - Architecture and how-to guides
- [API.md](API.md) - Endpoint specifications
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Status and next steps

**Code Examples**:
- Frontend hooks: [frontend/src/hooks](frontend/src/hooks)
- Backend services: [backend/src/services](backend/src/services)
- API routes: [backend/src/controllers/api.controller.ts](backend/src/controllers/api.controller.ts)

**External Resources**:
- Solana: https://docs.solana.com
- Next.js: https://nextjs.org/docs
- Fastify: https://www.fastify.io/docs

---

## 📊 Quick Statistics

| Metric | Value |
|--------|-------|
| Frontend Components | 5 |
| Backend Services | 4 |
| API Endpoints | 6 |
| Database Models | 6 |
| Documentation Pages | 6 |
| Lines of Code | ~2,000+ |
| Build Time | <1 minute |
| TypeScript Errors | 0 |

---

##  What's Ready

 Full-stack development environment
 Frontend dashboard with wallet integration
 Backend API with 6 endpoints
 Database schema with Prisma ORM
 AI integration (xAI Grok)
 Risk assessment system
 Comprehensive documentation
 Automated setup script
 Production build configuration

---

##  Vision

**Scentree** is building the future of Solana trading by combining:
- **Smart Risk Assessment**: Know what you're buying before you buy it
- **AI-Powered Insights**: Get recommendations from advanced AI analysis
- **Anti-Rug Protection**: Protect yourself from malicious tokens
- **User Control**: You approve every trade, we enforce guardrails

---

##  License

This project is provided as-is for development and bounty completion.

---

##  Questions?

1. Check the relevant documentation file
2. Review code examples in the project
3. Consult external API documentation
4. Ask in the project Discord (when available)

---

**Last Updated**: March 15, 2025
**Version**: 1.0.0
**Status**:  Active Development

**[START HERE →](README.md)**
