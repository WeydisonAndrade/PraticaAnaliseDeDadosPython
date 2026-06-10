import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
export declare class PaymentsService {
    private readonly prisma;
    private readonly commissionService;
    constructor(prisma: PrismaService, commissionService: CommissionService);
    getCommissionRules(): import("../common/types/business.types").BusinessRulesConfig;
    getBandEarnings(bandId: string, userId: string): Promise<{
        earnings: ({
            payment: {
                type: import(".prisma/client").$Enums.TransactionType;
                grossAmountCents: number;
                platformFeeCents: number;
                paidAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PayoutStatus;
            bandId: string;
            paymentId: string;
            paidAt: Date | null;
            amountCents: number;
        })[];
        pendingTotalCents: number;
        canRequestPayout: boolean;
        minPayoutCents: number;
    }>;
    requestPayout(bandId: string, userId: string): Promise<{
        message: string;
        amountCents: number;
        status: "PROCESSING";
    }>;
}
