import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { CustomMetricsService } from "../observability/services/custom-metrics.service";
export declare class AuthMetricsInterceptor implements NestInterceptor {
    private readonly metricsService;
    constructor(metricsService: CustomMetricsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
