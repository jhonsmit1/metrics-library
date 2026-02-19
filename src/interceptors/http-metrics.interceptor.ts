import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CustomMetricsService } from "../observability/services/custom-metrics.service"

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
    constructor(private readonly metricsService: CustomMetricsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http") {
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
