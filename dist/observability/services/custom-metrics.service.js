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
const observability_constants_1 = require("../observability.constants");
let CustomMetricsService = CustomMetricsService_1 = class CustomMetricsService {
    options;
    logger = new common_1.Logger(CustomMetricsService_1.name);
    meter;
    httpRequestsTotal;
    httpRequestDurationMs;
    dbQueryDurationSeconds;
    appErrorsTotal;
    authFailedAttemptsTotal;
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
        this.httpRequestsTotal = this.meter.createCounter("http_requests_total", {
            description: "Total number of HTTP requests",
            unit: "1",
        });
        this.httpRequestDurationMs = this.meter.createHistogram("http_request_duration_ms", {
            description: "HTTP request duration in milliseconds",
            unit: "ms",
        });
        this.dbQueryDurationSeconds = this.meter.createHistogram("db_query_duration_seconds", {
            description: "Database query duration in seconds",
            unit: "s",
        });
        this.appErrorsTotal = this.meter.createCounter("app_errors_total", {
            description: "Total number of application errors",
            unit: "1",
        });
        this.authFailedAttemptsTotal = this.meter.createCounter("auth_failed_attempts_total", {
            description: "Total number of failed authentication attempts",
            unit: "1",
        });
    }
    recordHttpRequest(method, endpoint, statusCode, durationMs, version = "v1") {
        if (!this.enabled)
            return;
        const attributes = {
            method,
            endpoint,
            status_code: statusCode.toString(),
            version,
        };
        this.httpRequestsTotal?.add(1, attributes);
        this.httpRequestDurationMs?.record(durationMs, attributes);
    }
    recordDbQuery(dbSystem, operation, durationSeconds, dbName) {
        if (!this.enabled)
            return;
        const attributes = {
            db_system: dbSystem,
            db_operation: operation,
        };
        if (dbName)
            attributes.db_name = dbName;
        this.dbQueryDurationSeconds?.record(durationSeconds, attributes);
    }
    recordAppError(errorType, endpoint, statusCode, severity = "error") {
        if (!this.enabled)
            return;
        this.appErrorsTotal?.add(1, {
            error_type: errorType,
            endpoint,
            status_code: statusCode.toString(),
            severity,
        });
    }
    recordAuthFailure(reason, endpoint) {
        if (!this.enabled)
            return;
        this.authFailedAttemptsTotal?.add(1, {
            reason,
            endpoint,
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