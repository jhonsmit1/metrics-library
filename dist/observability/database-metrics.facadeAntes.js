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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMetricsFacade = void 0;
const common_1 = require("@nestjs/common");
const custom_metrics_serviceAntes_1 = require("./custom-metrics.serviceAntes");
let DatabaseMetricsFacade = class DatabaseMetricsFacade {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    recordPostgresQuery(operation, durationSeconds, dbName) {
        this.metricsService?.recordDbQuery("postgresql", operation, durationSeconds, dbName);
    }
    recordAzureSqlQuery(operation, durationSeconds, dbName) {
        this.metricsService?.recordDbQuery("mssql", operation, durationSeconds, dbName);
    }
};
exports.DatabaseMetricsFacade = DatabaseMetricsFacade;
exports.DatabaseMetricsFacade = DatabaseMetricsFacade = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [custom_metrics_serviceAntes_1.CustomMetricsService])
], DatabaseMetricsFacade);
//# sourceMappingURL=database-metrics.facadeAntes.js.map