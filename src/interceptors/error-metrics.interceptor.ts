import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CustomMetricsService } from "../observability/services/custom-metrics.service"

@Injectable()
export class ErrorMetricsInterceptor implements NestInterceptor {
    constructor(private readonly metricsService: CustomMetricsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http") {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const endpoint = request.route?.path || request.url;

        return next.handle().pipe(
            catchError((error) => {
                const status =
                    error instanceof HttpException
                        ? error.getStatus()
                        : HttpStatus.INTERNAL_SERVER_ERROR;

                const severity = status >= 500 ? "error" : "warning";

                this.metricsService.recordAppError(
                    error.constructor?.name || "UnknownError",
                    endpoint,
                    status,
                    severity
                );

                return throwError(() => error);
            })
        );
    }
}
