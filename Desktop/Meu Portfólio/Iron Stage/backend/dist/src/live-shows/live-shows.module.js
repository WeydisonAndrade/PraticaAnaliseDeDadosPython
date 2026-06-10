"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveShowsModule = void 0;
const common_1 = require("@nestjs/common");
const live_shows_service_1 = require("./live-shows.service");
const live_shows_controller_1 = require("./live-shows.controller");
const access_control_module_1 = require("../access-control/access-control.module");
const commission_module_1 = require("../commission/commission.module");
let LiveShowsModule = class LiveShowsModule {
};
exports.LiveShowsModule = LiveShowsModule;
exports.LiveShowsModule = LiveShowsModule = __decorate([
    (0, common_1.Module)({
        imports: [access_control_module_1.AccessControlModule, commission_module_1.CommissionModule],
        controllers: [live_shows_controller_1.LiveShowsController],
        providers: [live_shows_service_1.LiveShowsService],
        exports: [live_shows_service_1.LiveShowsService],
    })
], LiveShowsModule);
//# sourceMappingURL=live-shows.module.js.map