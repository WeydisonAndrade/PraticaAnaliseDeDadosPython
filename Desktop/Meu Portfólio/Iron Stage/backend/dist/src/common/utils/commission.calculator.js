"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionCalculator = void 0;
const client_1 = require("@prisma/client");
class CommissionCalculator {
    static calculateSplit(grossAmountCents, type, config) {
        const percent = this.getCommissionPercent(type, config);
        const platformFeeCents = Math.round((grossAmountCents * percent) / 100);
        const bandAmountCents = grossAmountCents - platformFeeCents;
        return {
            grossAmountCents,
            platformFeeCents,
            bandAmountCents,
            platformFeePercent: percent,
        };
    }
    static getCommissionPercent(type, config) {
        switch (type) {
            case client_1.TransactionType.PPV:
                return config.commissionPpvPercent;
            case client_1.TransactionType.MARKETPLACE:
                return config.commissionMarketplacePercent;
            case client_1.TransactionType.SUBSCRIPTION:
                return config.commissionSubscriptionPercent;
            default:
                return 0;
        }
    }
    static validatePpvPrice(priceCents, config) {
        if (priceCents < config.minPpvPriceCents) {
            throw new Error(`Preço mínimo do PPV: R$ ${(config.minPpvPriceCents / 100).toFixed(2)}`);
        }
        if (priceCents > config.maxPpvPriceCents) {
            throw new Error(`Preço máximo do PPV: R$ ${(config.maxPpvPriceCents / 100).toFixed(2)}`);
        }
    }
    static calculatePpvAccessWindow(scheduledAt, endsAt, config) {
        const accessFrom = new Date(scheduledAt);
        accessFrom.setHours(accessFrom.getHours() - config.ppvAccessHoursBefore);
        const accessUntil = endsAt ? new Date(endsAt) : new Date(scheduledAt);
        if (!endsAt) {
            accessUntil.setHours(accessUntil.getHours() + 3);
        }
        accessUntil.setHours(accessUntil.getHours() + config.ppvAccessHoursAfter);
        return { accessFrom, accessUntil };
    }
}
exports.CommissionCalculator = CommissionCalculator;
//# sourceMappingURL=commission.calculator.js.map