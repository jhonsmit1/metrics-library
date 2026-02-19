import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CustomMetricsService } from "./services/custom-metrics.service";
import { DatabaseMetricsFacade } from "./facades/database-metrics.facade";
import { OBSERVABILITY_OPTIONS } from "./observability.constants";
import { ObservabilityOptions } from "./observability.interfaces";
import { HttpMetricsInterceptor } from "../interceptors/http-metrics.interceptor";
import { ErrorMetricsInterceptor } from "../interceptors/error-metrics.interceptor";
import { AuthMetricsInterceptor } from "../interceptors/auth-metrics.interceptor";

@Global()
@Module({})
export class ObservabilityModule {
    static forRoot(options: ObservabilityOptions): DynamicModule {
        const interceptors: Provider[] = [];

        if (options.enableHttpMetrics) {
            interceptors.push({
                provide: APP_INTERCEPTOR,
                useClass: HttpMetricsInterceptor,
            });
        }

        if (options.enableErrorMetrics) {
            interceptors.push({
                provide: APP_INTERCEPTOR,
                useClass: ErrorMetricsInterceptor,
            });
        }

        if (options.enableAuthMetrics) {
            interceptors.push({
                provide: APP_INTERCEPTOR,
                useClass: AuthMetricsInterceptor,
            });
        }

        return {
            module: ObservabilityModule,
            providers: [
                {
                    provide: OBSERVABILITY_OPTIONS,
                    useValue: options,
                },
                CustomMetricsService,
                DatabaseMetricsFacade,
                ...interceptors,
            ],
            exports: [DatabaseMetricsFacade],
        };
    }
}
