"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const ai_service_1 = require("./services/ai.service");
const risk_service_1 = require("./services/risk.service");
const api_controller_1 = __importDefault(require("./controllers/api.controller"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
let prisma = null;
const aiService = new ai_service_1.AIService();
const riskService = new risk_service_1.RiskService();
// Lazy initialize Prisma
const getPrisma = async () => {
    if (!prisma) {
        try {
            const { PrismaClient } = await Promise.resolve().then(() => __importStar(require('@prisma/client')));
            prisma = new PrismaClient();
        }
        catch (error) {
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