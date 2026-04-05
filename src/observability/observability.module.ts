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
  static forRootAsync(options: {
    useFactory: (...args: any[]) => ObservabilityOptions;
    inject?: any[];
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: OBSERVABILITY_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      CustomMetricsService,
      DatabaseMetricsFacade,
    ];

    providers.push({
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    });

    providers.push({
      provide: APP_INTERCEPTOR,
      useClass: ErrorMetricsInterceptor,
    });

    providers.push({
      provide: APP_INTERCEPTOR,
      useClass: AuthMetricsInterceptor,
    });

    return {
      module: ObservabilityModule,
      providers,
      exports: [DatabaseMetricsFacade],
    };
  }
}

