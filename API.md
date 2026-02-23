# Scentree API Reference

Complete documentation for all Scentree backend API endpoints.

## 🔐 Authentication

Currently, **no authentication** is required. In production, implement:

```typescript
// Example JWT authentication
fastify.post('/auth/login', async (request, reply) => {
  const token = jwt.sign({ wallet: address }, SECRET);
  reply.send({ token });
});

// Middleware to verify token
fastify.register(fastifyJwt, { secret: SECRET });
```

## 📡 Base URL

**Development**: `http://localhost:3001`
**Production**: `https://api.scentree.app`

All requests use `Content-Type: application/json`

---

## 1. AI Intent Analysis

### POST /api/analyze-intent

Analyze user's wallet and portfolio to get AI-powered recommendations.

#### Request

```bash
curl -X POST http://localhost:3001/api/analyze-intent \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "9P3t..."
  }'
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `walletAddress` | string | ✅ | Solana wallet public key |

#### Response (200 OK)

```json
{
  "suggestion": "Consider reducing COPE position to 25% of portfolio",
  "confidence": 0.87,
  "riskRating": 65,
  "reasoning": "COPE is currently 48% of your portfolio, creating concentration risk. Current market conditions suggest a rebalance would improve risk-adjusted returns."
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `suggestion` | string | AI's specific recommendation |
| `confidence` | number | Confidence score (0-1) |
| `riskRating` | number | Estimated portfolio risk (1-100) |
| `reasoning` | string | Explanation of the recommendation |

#### Error Responses

```json
// 400 Bad Request - Missing parameter
{
  "error": "Missing required parameter: walletAddress"
}

// 500 Internal Server Error - Service unavailable
{
  "error": "AI service unavailable. Using fallback analysis."
}
```

#### Example Usage

**Frontend Hook**:
```typescript
const { analyzeIntent } = useAPI();

const handleAnalyze = async () => {
  const result = await analyzeIntent(publicKey?.toBase58()!);
  console.log(result.suggestion);
  console.log(`Confidence: ${Math.round(result.confidence * 100)}%`);
};
```

#### Notes

- First call for a wallet creates user record in database
- Decisions are logged for audit trail
- Uses xAI Grok API with fallback mock responses
- Analyzes current portfolio composition and market context

---

## 2. Token Risk Scanning

### GET /api/scan-token/:mint

Analyze a specific token for rug-pull and security risks.

#### Request

```bash
curl -X GET http://localhost:3001/api/scan-token/EPjFWaLb3odccccccccPb8d5OqHmbqWuL5vdZjJsJu
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mint` | string | ✅ | Solana token mint address |

#### Response (200 OK)

```json
{
  "rugRiskScore": 28,
  "riskLevel": "Safe",
  "liquidity": 1250000,
  "mintAuthority": null,
  "topHolderPercent": 8.5,
  "explanation": "Token has sufficient liquidity (>$1M) and mint authority is disabled. Top holder owns <10% of supply. Risk level is low."
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `rugRiskScore` | number | Risk score 0-100 (0=safe, 100=certain rug) |
| `riskLevel` | string | "Safe", "Caution", or "HighRisk" |
| `liquidity` | number | Token liquidity in USD |
| `mintAuthority` | string \| null | Mint authority address (null = disabled) |
| `topHolderPercent` | number | Top holder's % of supply |
| `explanation` | string | Risk analysis details |

#### Risk Level Scale

| Score | Level | Action |
|-------|-------|--------|
| 0-25 | Safe | ✅ No warnings |
| 25-50 | Caution | ⚠️ Review before trading |
| 50-75 | HighRisk | 🚫 Requires user confirmation |
| 75-100 | Critical | 🔴 Blocked by default |

#### Error Responses

```json
// 400 Bad Request - Invalid mint
{
  "error": "Invalid mint address"
}

// 404 Not Found - Token doesn't exist
{
  "error": "Token not found on blockchain"
}

// 500 Internal Server Error
{
  "error": "Risk analysis service unavailable"
}
```

#### Example Usage

**Frontend Hook**:
```typescript
const { scanToken } = useAPI();

const checkTokenRisk = async (mint: string) => {
  const risk = await scanToken(mint);
  
  if (risk.rugRiskScore > 50) {
    showWarning(`⚠️ ${risk.explanation}`);
  }
};
```

#### Caching

- Results cached in database for 24 hours
- Subsequent requests return cached result with `cachedAt` timestamp
- Background job refreshes cache periodically

#### Notes

- Checks Helius API for liquidity and authority data
- Analyzes holder distribution from on-chain data
- Identifies common rug-pull patterns
- Results are deterministic for same mint

---

## 3. Risk Profile Management

### GET /api/risk-profile/:walletAddress

Retrieve user's risk profile and settings.

#### Request

```bash
curl -X GET http://localhost:3001/api/risk-profile/9B5X7sEjh3KqvuPWYzqMXKwAc7Qb8rP9
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `walletAddress` | string | ✅ | User's Solana wallet address |

#### Response (200 OK)

```json
{
  "riskLevel": 65,
  "maxAllocPct": 0.1,
  "stopLossPct": 10,
  "dailyTradeLimit": 5
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `riskLevel` | number | User's risk tolerance 1-100 |
| `maxAllocPct` | number | Max % to allocate per trade (0.05-0.25) |
| `stopLossPct` | number | Stop-loss trigger in % (2-20) |
| `dailyTradeLimit` | number | Max trades per day (1-50) |

#### Error Responses

```json
// 404 Not Found - User doesn't exist
{
  "error": "User not found. Create profile first with POST."
}
```

#### Example Usage

**Frontend Hook**:
```typescript
const { getRiskProfile } = useAPI();

useEffect(() => {
  const fetchProfile = async () => {
    const profile = await getRiskProfile(walletAddress);
    setUserRiskLevel(profile.riskLevel);
  };
  
  fetchProfile();
}, [walletAddress]);
```

---

### PUT /api/risk-profile/:walletAddress

Update user's risk profile settings.

#### Request

```bash
curl -X PUT http://localhost:3001/api/risk-profile/9B5X7sEjh3KqvuPWYzqMXKwAc7Qb8rP9 \
  -H "Content-Type: application/json" \
  -d '{
    "riskLevel": 75,
    "maxAllocPct": 0.15,
    "stopLossPct": 8
  }'
```

#### Request Body (all optional)

| Field | Type | Default | Constraints |
|-------|------|---------|-------------|
| `riskLevel` | number | 50 | 1-100 |
| `maxAllocPct` | number | 0.1 | 0.05-0.25 |
| `stopLossPct` | number | 10 | 2-20 |
| `dailyTradeLimit` | number | 5 | 1-50 |

#### Response (200 OK)

```json
{
  "updated": true,
  "profile": {
    "riskLevel": 75,
    "maxAllocPct": 0.15,
    "stopLossPct": 8,
    "dailyTradeLimit": 5
  }
}
```

#### Error Responses

```json
// 400 Bad Request - Invalid values
{
  "error": "riskLevel must be between 1 and 100"
}

// 404 Not Found
{
  "error": "User not found"
}
```

#### Example Usage

**Frontend Component**:
```typescript
const handleRiskUpdate = async () => {
  const result = await updateRiskProfile(walletAddress, {
    riskLevel: 80,
    maxAllocPct: 0.12
  });
  
  if (result.updated) {
    toast.success('Risk settings updated');
  }
};
```

---

## 4. Trade History

### GET /api/trade-history/:walletAddress

Retrieve user's historical trades and execution logs.

#### Request

```bash
curl -X GET "http://localhost:3001/api/trade-history/9B5X7sEjh3KqvuPWYzqMXKwAc7Qb8rP9?limit=20&offset=0"
```

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `walletAddress` | string | ✅ | User's wallet address |
| `limit` | number | ❌ | Results per page (default: 20, max: 100) |
| `offset` | number | ❌ | Pagination offset (default: 0) |

#### Response (200 OK)

```json
{
  "trades": [
    {
      "id": "tx_abc123...",
      "fromToken": "SOL",
      "toToken": "COPE",
      "fromAmount": 10,
      "toAmount": 145.23,
      "price": 14.523,
      "riskScore": 45,
      "status": "Success",
      "timestamp": "2025-03-15T14:32:15Z",
      "txHash": "5ksZ7vN8..."
    },
    {
      "id": "tx_def456...",
      "fromToken": "COPE",
      "toToken": "BONK",
      "fromAmount": 145.23,
      "toAmount": 1234567,
      "price": 0.0001175,
      "riskScore": 72,
      "status": "Failed",
      "timestamp": "2025-03-15T13:10:22Z",
      "txHash": "4jrX6uM7...",
      "error": "Slippage exceeded 5%"
    }
  ],
  "total": 42,
  "page": 1
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique trade ID |
| `fromToken` | string | Source token symbol |
| `toToken` | string | Destination token symbol |
| `fromAmount` | number | Amount sent |
| `toAmount` | number | Amount received |
| `price` | number | Execution price |
| `riskScore` | number | Risk assessment at execution (0-100) |
| `status` | string | "Pending", "Success", "Failed", "Cancelled" |
| `timestamp` | ISO 8601 | When trade occurred |
| `txHash` | string | Solana transaction signature (if confirmed) |
| `error` | string | Error message if failed |

#### Error Responses

```json
// 404 Not Found
{
  "error": "User not found"
}

// 400 Bad Request - Invalid pagination
{
  "error": "limit must be between 1 and 100"
}
```

#### Example Usage

**Frontend Hook**:
```typescript
const { getTradeHistory } = useAPI();

useEffect(() => {
  const fetchHistory = async () => {
    const { trades, total } = await getTradeHistory(walletAddress, {
      limit: 10,
      offset: 0
    });
    
    setTrades(trades);
    setTotalCount(total);
  };
  
  fetchHistory();
}, [walletAddress]);
```

#### Filters (Future)

```bash
# Filter by status
/api/trade-history/:wallet?status=Success

# Filter by date range
/api/trade-history/:wallet?fromDate=2025-03-01&toDate=2025-03-31

# Filter by token
/api/trade-history/:wallet?fromToken=SOL
```

---

## 5. Health Check

### GET /health

Simple health check endpoint for monitoring.

#### Request

```bash
curl http://localhost:3001/health
```

#### Response (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2025-03-15T14:35:00Z",
  "version": "1.0.0"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | "ok" or "degraded" |
| `timestamp` | ISO 8601 | Server time |
| `version` | string | API version |

#### Usage

Use for monitoring and load balancer health checks.

---

## 6. Futures Endpoints (Not Yet Implemented)

### POST /api/get-swap-quote

Get Jupiter swap quote.

```bash
curl -X POST http://localhost:3001/api/get-swap-quote \
  -H "Content-Type: application/json" \
  -d '{
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "EPjFWaLb3odccccccccPb8d5OqHmbqWuL5vdZjJsJu",
    "amount": 1000000000,
    "slippageBps": 50
  }'
```

### POST /api/execute-trade

Execute a swap transaction.

```bash
curl -X POST http://localhost:3001/api/execute-trade \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "9B5X7sEjh3...",
    "inputMint": "So11111111...",
    "outputMint": "EPjFWaLb3o...",
    "amount": 1000000000,
    "slippageBps": 50
  }'
```

### POST /api/setup-vault

Initialize secure vault for wallet.

```bash
curl -X POST http://localhost:3001/api/setup-vault \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "9B5X7sEjh3...",
    "encryptedKey": "encrypted_base64_key",
    "backupEmail": "user@example.com"
  }'
```

---

## Error Codes

### Standard HTTP Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Missing required parameter |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | External API down |

### Custom Error Codes (Response Body)

```json
{
  "code": "INVALID_WALLET_ADDRESS",
  "error": "Wallet address must be valid base58",
  "field": "walletAddress"
}
```

---

## Rate Limiting

**Current**: No rate limiting (development mode)

**Planned**:
```
- 100 requests per minute per IP
- 1000 requests per hour per wallet
- 10 trades per day per wallet
```

---

## Request/Response Format

### Headers

```http
Content-Type: application/json
Accept: application/json
```

### Success Response Format

```json
{
  "data": { ... },
  "success": true,
  "timestamp": "2025-03-15T14:35:00Z"
}
```

### Error Response Format

```json
{
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2025-03-15T14:35:00Z"
}
```

---

## Examples by Use Case

### User Starts Using Scentree

```typescript
// 1. Analyze portfolio
const analysis = await POST /api/analyze-intent
  { walletAddress: "9B5..." }

// 2. Set risk preferences
const profile = await PUT /api/risk-profile/9B5...
  { riskLevel: 70, maxAllocPct: 0.1 }

// 3. Get recommendations
const riskProfile = await GET /api/risk-profile/9B5...
```

### User Wants to Trade a Token

```typescript
// 1. Scan token for risk
const risk = await GET /api/scan-token/:mint

// 2. Check if within risk parameters
if (risk.rugRiskScore < 50 && userRiskLevel >= requiredRisk) {
  // 3. Get swap quote (future)
  const quote = await POST /api/get-swap-quote
  
  // 4. Execute trade (future)
  const result = await POST /api/execute-trade
}
```

### User Reviews Trading History

```typescript
// Get all trades
const { trades, total } = await GET /api/trade-history/9B5...
  ?limit=20&offset=0

// Analyze performance
const winRate = trades.filter(t => t.riskScore < 40).length / trades.length
```

---

## Webhook Events (Future)

```typescript
// Trade Executed
POST /webhook/trade-executed
{
  "walletAddress": "9B5...",
  "txHash": "5kX...",
  "status": "success"
}

// Risk Alert
POST /webhook/risk-alert
{
  "walletAddress": "9B5...",
  "level": "high",
  "message": "Portfolio concentration exceeded 60%"
}
```

---

## Deprecation Policy

- **Announcement**: 90 days before deprecation
- **Support**: 6 months after announcement
- **Removal**: 9 months after announcement

---

## Support

- **Issues**: [GitHub Issues](https://github.com/scentree/scentree/issues)
- **Email**: support@scentree.app
- **Discord**: [Community Server](https://discord.gg/scentree)
- **Docs**: [Full Documentation](https://docs.scentree.app)

---

**Last Updated**: March 2025
**API Version**: 1.0.0
**Status**: 🟢 Active
