import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { CustomMetricsService } from "../observability/services/custom-metrics.service";
import { ObservabilityOptions } from "../observability/observability.interfaces";
export declare class HttpMetricsInterceptor implements NestInterceptor {
    private readonly metricsService;
    private readonly options;
    constructor(metricsService: CustomMetricsService, options: ObservabilityOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
