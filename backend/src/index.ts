import Fastify from 'fastify';
import cors from '@fastify/cors';
import { AIService } from './services/ai.service';
import { RiskService } from './services/risk.service';
import apiController from './controllers/api.controller';

const fastify = Fastify({
    logger: true,
});

let prisma: any = null;
const aiService = new AIService();
const riskService = new RiskService();

// Lazy initialize Prisma
const getPrisma = async () => {
    if (!prisma) {
        try {
            const { PrismaClient } = await import('@prisma/client');
            prisma = new PrismaClient();
        } catch (error) {
            console.warn('Warning: Could not initialize Prisma, running without database support');
            prisma = {}; // Fallback to empty object for API compatibility
        }
    }
    return prisma;
};

// Attach services to fastify context
fastify.decorate('getPrisma', getPrisma);
fastify.decorate('aiService', aiService);
fastify.decorate('riskService', riskService);

async function start() {
    try {
        // Register CORS
        await fastify.register(cors, {
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });

        // Register routes
        await fastify.register(apiController);

        // Health check
        fastify.get('/health', async (request, reply) => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });

        const PORT = parseInt(process.env.PORT || '3001', 10);
        const HOST = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port: PORT, host: HOST });
        console.log(`✨ Server running at http://${HOST}:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
});

start();
