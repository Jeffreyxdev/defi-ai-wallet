export declare class RiskService {
    private heliusApiKey;
    constructor();
    scanToken(mintAddress: string): Promise<{
        mintAddress: string;
        rugRiskScore: number;
        riskLevel: string;
        explanation: string;
    }>;
    private getMockRisk;
}
//# sourceMappingURL=risk.service.d.ts.map