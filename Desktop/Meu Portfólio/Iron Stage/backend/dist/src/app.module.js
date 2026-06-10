"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const commission_module_1 = require("./commission/commission.module");
const access_control_module_1 = require("./access-control/access-control.module");
const auth_module_1 = require("./auth/auth.module");
const bands_module_1 = require("./bands/bands.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const content_module_1 = require("./content/content.module");
const live_shows_module_1 = require("./live-shows/live-shows.module");
const marketplace_module_1 = require("./marketplace/marketplace.module");
const payments_module_1 = require("./payments/payments.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            commission_module_1.CommissionModule,
            access_control_module_1.AccessControlModule,
            auth_module_1.AuthModule,
            bands_module_1.BandsModule,
            subscriptions_module_1.SubscriptionsModule,
            content_module_1.ContentModule,
            live_shows_module_1.LiveShowsModule,
            marketplace_module_1.MarketplaceModule,
            payments_module_1.PaymentsModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map