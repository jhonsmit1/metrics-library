import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CustomMetricsService } from "../observability/services/custom-metrics.service"

@Injectable()
export class AuthMetricsInterceptor implements NestInterceptor {
    constructor(private readonly metricsService: CustomMetricsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http") {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const endpoint = request.route?.path || request.url;

        return next.handle().pipe(
            catchError((error) => {
                if (
                    error instanceof UnauthorizedException ||
                    error?.status === 401 ||
                    error?.status === 403
                ) {
                    this.metricsService.recordAuthFailure(
                        "invalid_token",
                        endpoint
                    );
                }

                return throwError(() => error);
            })
        );
    }
}
