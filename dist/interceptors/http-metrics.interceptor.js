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
exports.HttpMetricsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const custom_metrics_service_1 = require("../observability/services/custom-metrics.service");
const observability_constants_1 = require("src/observability/observability.constants");
let HttpMetricsInterceptor = class HttpMetricsInterceptor {
    metricsService;
    options;
    constructor(metricsService, options) {
        this.metricsService = metricsService;
        this.options = options;
    }
    intercept(context, next) {
        if (context.getType() !== "http" || !this.options?.enableHttpMetrics) {
            return next.handle();
        }
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const startTime = Date.now();
        const method = request.method;
        const endpoint = request.route?.path || request.url;
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const duration = Date.now() - startTime;
                this.metricsService.recordHttpRequest(method, endpoint, response.statusCode, duration);
            },
            error: (error) => {
                const duration = Date.now() - startTime;
                this.metricsService.recordHttpRequest(method, endpoint, error?.status || 500, duration);
            },
        }));
    }
};
exports.HttpMetricsInterceptor = HttpMetricsInterceptor;
exports.HttpMetricsInterceptor = HttpMetricsInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(observability_constants_1.OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [custom_metrics_service_1.CustomMetricsService, Object])
], HttpMetricsInterceptor);
//# sourceMappingURL=http-metrics.interceptor.js.map