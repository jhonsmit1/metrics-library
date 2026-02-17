"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ObservabilityModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityModule = void 0;
const common_1 = require("@nestjs/common");
const custom_metrics_service_1 = require("./custom-metrics.service");
const database_metrics_facade_1 = require("./database-metrics.facade");
const observability_constants_1 = require("./observability.constants");
let ObservabilityModule = ObservabilityModule_1 = class ObservabilityModule {
    static forRoot(options) {
        return {
            module: ObservabilityModule_1,
            providers: [
                {
                    provide: observability_constants_1.OBSERVABILITY_OPTIONS,
                    useValue: options,
                },
                custom_metrics_service_1.CustomMetricsService,
                database_metrics_facade_1.DatabaseMetricsFacade,
            ],
            exports: [database_metrics_facade_1.DatabaseMetricsFacade],
        };
    }
};
exports.ObservabilityModule = ObservabilityModule;
exports.ObservabilityModule = ObservabilityModule = ObservabilityModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], ObservabilityModule);
//# sourceMappingURL=observability.module.js.map