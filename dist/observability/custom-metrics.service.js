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
var CustomMetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMetricsService = void 0;
const common_1 = require("@nestjs/common");
const api_1 = require("@opentelemetry/api");
const observability_constants_1 = require("./observability.constants");
let CustomMetricsService = CustomMetricsService_1 = class CustomMetricsService {
    options;
    logger = new common_1.Logger(CustomMetricsService_1.name);
    meter;
    dbQueryDurationSeconds;
    enabled = true;
    constructor(options) {
        this.options = options;
    }
    onModuleInit() {
        this.enabled = this.options?.enabled !== false;
        if (!this.enabled) {
            this.logger.warn("Observability metrics disabled");
            return;
        }
        const serviceName = this.options?.serviceName ?? "unknown-service";
        const version = this.options?.serviceVersion ?? "1.0.0";
        this.meter = api_1.metrics.getMeter(serviceName, version);
        this.initializeMetrics();
        this.logger.log("CustomMetricsService initialized");
    }
    initializeMetrics() {
        if (!this.meter)
            return;
        this.dbQueryDurationSeconds = this.meter.createHistogram("db_query_duration_seconds", {
            description: "Database query duration in seconds",
            unit: "s",
        });
    }
    recordDbQuery(dbSystem, operation, durationSeconds, dbName) {
        if (!this.enabled || !this.dbQueryDurationSeconds)
            return;
        this.dbQueryDurationSeconds.record(durationSeconds, {
            "db.system": dbSystem,
            "db.operation": operation,
            ...(dbName && { "db.name": dbName }),
        });
    }
};
exports.CustomMetricsService = CustomMetricsService;
exports.CustomMetricsService = CustomMetricsService = CustomMetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(observability_constants_1.OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], CustomMetricsService);
//# sourceMappingURL=custom-metrics.service.js.map