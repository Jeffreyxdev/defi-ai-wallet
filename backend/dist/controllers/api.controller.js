"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = apiController;
const ai_service_1 = require("../services/ai.service");
const risk_service_1 = require("../services/risk.service");
const client_1 = require("@prisma/client");
const aiService = new ai_service_1.AIService();
const riskService = new risk_service_1.RiskService();
const prisma = new client_1.PrismaClient();
async function apiController(fastify) {
    // AI Intent Analysis
    fastify.post('/api/analyze-intent', async (request, reply) => {
        const { intent, walletAddress, portfolioData } = request.body;
        if (!walletAddress) {
            return reply.status(400).send({ error: "Wallet address is required." });
        }
        try {
            const analysis = await aiService.analyzeIntent(intent, portfolioData);
            // Log the decision
            await prisma.aIDecisions.create({
                data: {
                    userId: walletAddress,
                    intent,
                    suggestion: analysis.suggestion,
                    confidence: analysis.confidence,
                    reasoning: analysis.reasoning,
                    riskRating: analysis.riskRating,
                }
            }).catch(e => console.error("Prisma logging error:", e));
            return reply.send(analysis);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: "Failed to analyze intent" });
        }
    });
    // Token Risk Scanning
    fastify.get('/api/scan-token/:mint', async (request, reply) => {
        const { mint } = request.params;
        if (!mint) {
            return reply.status(400).send({ error: "Mint address is required." });
        }
        try {
            const scanResult = await riskService.scanToken(mint);
            // Cache the result
            await prisma.tokenRisk.upsert({
                where: { mintAddress: mint },
                update: {
                    rugRiskScore: scanResult.rugRiskScore,
                    riskLevel: scanResult.riskLevel,
                    explanation: scanResult.explanation,
                    lastChecked: new Date(),
                },
                create: {
                    mintAddress: mint,
                    rugRiskScore: scanResult.rugRiskScore,
                    riskLevel: scanResult.riskLevel,
                    explanation: scanResult.explanation,
                }
            }).catch(e => console.error("Token cache error:", e));
            return reply.send(scanResult);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: "Failed to scan token" });
        }
    });
    // User Risk Profile
    fastify.get('/api/risk-profile/:walletAddress', async (request, reply) => {
        const { walletAddress } = request.params;
        if (!walletAddress) {
            return reply.status(400).send({ error: "Wallet address is required." });
        }
        try {
            const user = await prisma.user.findUnique({
                where: { walletAddress },
                include: { riskProfile: true, settings: true }
            });
            if (!user) {
                // Create new user and profile
                const newUser = await prisma.user.create({
                    data: {
                        walletAddress,
                        riskProfile: {
                            create: {
                                riskScore: 50,
                                riskLevel: "Medium",
                            }
                        },
                        settings: {
                            create: {}
                        }
                    },
                    include: { riskProfile: true, settings: true }
                });
                return reply.send(newUser);
            }
            return reply.send(user);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch risk profile" });
        }
    });
    // Update Risk Profile
    fastify.put('/api/risk-profile/:walletAddress', async (request, reply) => {
        const { walletAddress } = request.params;
        const { riskScore, riskLevel } = request.body;
        if (!walletAddress || riskScore === undefined) {
            return reply.status(400).send({ error: "Wallet address and risk score are required." });
        }
        try {
            const user = await prisma.user.findUnique({
                where: { walletAddress },
            });
            if (!user) {
                return reply.status(404).send({ error: "User not found" });
            }
            const updated = await prisma.riskProfile.update({
                where: { userId: user.id },
                data: {
                    riskScore,
                    riskLevel: riskLevel || "Medium",
                }
            });
            return reply.send(updated);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: "Failed to update risk profile" });
        }
    });
    // Get Trade History
    fastify.get('/api/trade-history/:walletAddress', async (request, reply) => {
        const { walletAddress } = request.params;
        if (!walletAddress) {
            return reply.status(400).send({ error: "Wallet address is required." });
        }
        try {
            const user = await prisma.user.findUnique({
                where: { walletAddress },
            });
            if (!user) {
                return reply.send([]);
            }
            const trades = await prisma.tradeLog.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 50
            });
            return reply.send(trades);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch trade history" });
        }
    });
}
//# sourceMappingURL=api.controller.js.map