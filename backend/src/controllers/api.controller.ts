import { FastifyRequest, FastifyReply } from 'fastify';
import { AIService } from '../services/ai.service';
import { RiskService } from '../services/risk.service';
import { PrismaClient } from '@prisma/client';

const aiService = new AIService();
const riskService = new RiskService();
const prisma = new PrismaClient();

export const analyzeIntent = async (request: FastifyRequest, reply: FastifyReply) => {
    const { intent, walletAddress, portfolioData } = request.body as any;
    
    if (!walletAddress) {
        return reply.status(400).send({ error: "Wallet address is required." });
    }

    const analysis = await aiService.analyzeIntent(intent, portfolioData);
    
    // Log the decision
    await prisma.aIDecisions.create({
        data: {
            userId: walletAddress, // Simplified for MVP, should map to User.id
            intent,
            suggestion: analysis.suggestion,
            confidence: analysis.confidence,
            reasoning: analysis.reasoning,
            riskRating: analysis.riskRating,
        }
    }).catch(e => console.error("Prisma logging error:", e));

    return analysis;
};

export const scanToken = async (request: FastifyRequest, reply: FastifyReply) => {
    const { mint } = request.params as any;
    const scanResult = await riskService.scanToken(mint);
    return scanResult;
};
