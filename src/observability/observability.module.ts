import { DynamicModule, Global, Module } from "@nestjs/common";
import { CustomMetricsService } from "./custom-metrics.service";
import { DatabaseMetricsFacade } from "./database-metrics.facade";
import { OBSERVABILITY_OPTIONS } from "./observability.constants";
import { ObservabilityOptions } from "./observability.interfaces";

@Global()
@Module({})
export class ObservabilityModule {
    static forRoot(options: ObservabilityOptions): DynamicModule {
        return {
            module: ObservabilityModule,
            providers: [
                {
                    provide: OBSERVABILITY_OPTIONS,
                    useValue: options,
                },
                CustomMetricsService,
                DatabaseMetricsFacade,
            ],
            exports: [DatabaseMetricsFacade],
        };
    }
}
