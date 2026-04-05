import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CustomMetricsService } from "../observability/services/custom-metrics.service"
import { OBSERVABILITY_OPTIONS } from "src/observability/observability.constants";
import { ObservabilityOptions } from "src/observability/observability.interfaces";

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
    constructor(
        private readonly metricsService: CustomMetricsService,
        @Inject(OBSERVABILITY_OPTIONS)
        private readonly options: ObservabilityOptions
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http" || !this.options?.enableHttpMetrics) {
            return next.handle();
        }

        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();

        const startTime = Date.now();
        const method = request.method;
        const endpoint = request.route?.path || request.url;

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;
                    this.metricsService.recordHttpRequest(
                        method,
                        endpoint,
                        response.statusCode,
                        duration
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.metricsService.recordHttpRequest(
                        method,
                        endpoint,
                        error?.status || 500,
                        duration
                    );
                },
            })
        );
    }
}
