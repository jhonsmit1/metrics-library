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
exports.ErrorMetricsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const custom_metrics_service_1 = require("../observability/services/custom-metrics.service");
let ErrorMetricsInterceptor = class ErrorMetricsInterceptor {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    intercept(context, next) {
        if (context.getType() !== "http") {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const endpoint = request.route?.path || request.url;
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            const status = error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const severity = status >= 500 ? "error" : "warning";
            this.metricsService.recordAppError(error.constructor?.name || "UnknownError", endpoint, status, severity);
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
};
exports.ErrorMetricsInterceptor = ErrorMetricsInterceptor;
exports.ErrorMetricsInterceptor = ErrorMetricsInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [custom_metrics_service_1.CustomMetricsService])
], ErrorMetricsInterceptor);
//# sourceMappingURL=error-metrics.interceptor.js.map