import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getCommissionRules(): import("../common/types/business.types").BusinessRulesConfig;
    getBandEarnings(bandId: string, user: {
        id: string;
    }): Promise<{
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
    requestPayout(bandId: string, user: {
        id: string;
    }): Promise<{
        message: string;
        amountCents: number;
        status: "PROCESSING";
    }>;
}
