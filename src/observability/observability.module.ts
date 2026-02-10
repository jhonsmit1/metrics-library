import { Global, Module } from "@nestjs/common";
import { CustomMetricsService } from "./custom-metrics.service";
import { DatabaseMetricsFacade } from "./database-metrics.facade";

@Global()
@Module({
    providers: [
        CustomMetricsService,
        DatabaseMetricsFacade,
    ],
    exports: [
        DatabaseMetricsFacade,
    ],
})
export class ObservabilityModule { }
