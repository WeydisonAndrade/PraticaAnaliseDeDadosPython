"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const commission_calculator_1 = require("../common/utils/commission.calculator");
let CommissionService = class CommissionService {
    configService;
    config;
    constructor(configService) {
        this.configService = configService;
        this.config = {
            commissionPpvPercent: this.configService.get('COMMISSION_PPV_PERCENT', 20),
            commissionMarketplacePercent: this.configService.get('COMMISSION_MARKETPLACE_PERCENT', 15),
            commissionSubscriptionPercent: this.configService.get('COMMISSION_SUBSCRIPTION_PERCENT', 30),
            minPayoutAmountCents: this.configService.get('MIN_PAYOUT_AMOUNT_CENTS', 5000),
            minPpvPriceCents: this.configService.get('MIN_PPV_PRICE_CENTS', 1000),
            maxPpvPriceCents: this.configService.get('MAX_PPV_PRICE_CENTS', 50000),
            ppvAccessHoursBefore: this.configService.get('PPV_ACCESS_HOURS_BEFORE', 1),
            ppvAccessHoursAfter: this.configService.get('PPV_ACCESS_HOURS_AFTER', 24),
        };
    }
    getConfig() {
        return { ...this.config };
    }
    calculateSplit(grossAmountCents, type) {
        return commission_calculator_1.CommissionCalculator.calculateSplit(grossAmountCents, type, this.config);
    }
    validatePpvPrice(priceCents) {
        commission_calculator_1.CommissionCalculator.validatePpvPrice(priceCents, this.config);
    }
    calculatePpvAccessWindow(scheduledAt, endsAt) {
        return commission_calculator_1.CommissionCalculator.calculatePpvAccessWindow(scheduledAt, endsAt, this.config);
    }
    canRequestPayout(pendingEarningsCents) {
        return pendingEarningsCents >= this.config.minPayoutAmountCents;
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CommissionService);
//# sourceMappingURL=commission.service.js.map