"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const ai_service_1 = require("./services/ai.service");
const risk_service_1 = require("./services/risk.service");
const api_controller_1 = __importDefault(require("./controllers/api.controller"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
const prisma = new client_1.PrismaClient();
const aiService = new ai_service_1.AIService();
const riskService = new risk_service_1.RiskService();
// Attach services to fastify context
fastify.decorate('prisma', prisma);
fastify.decorate('aiService', aiService);
fastify.decorate('riskService', riskService);
async function start() {
    try {
        // Register CORS
        await fastify.register(cors_1.default, {
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });
        // Register routes
        await fastify.register(api_controller_1.default);
        // Health check
        fastify.get('/health', async (request, reply) => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });
        const PORT = parseInt(process.env.PORT || '3001', 10);
        const HOST = process.env.HOST || '0.0.0.0';
        await fastify.listen({ port: PORT, host: HOST });
        console.log(`✨ Server running at http://${HOST}:${PORT}`);
    }
    catch (err) {
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
//# sourceMappingURL=index.js.map