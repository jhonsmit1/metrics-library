import { Injectable, Optional } from "@nestjs/common";
import { CustomMetricsService } from "./custom-metrics.service";

/**
 * Facade to record database metrics.
 * Safe to use even if metrics are disabled.
 */
@Injectable()
export class DatabaseMetricsFacade {
    constructor(
        @Optional()
        private readonly metricsService?: CustomMetricsService
    ) { }

    recordPostgresQuery(
        operation: string,
        durationSeconds: number,
        dbName?: string
    ): void {
        this.metricsService?.recordDbQuery(
            "postgresql",
            operation,
            durationSeconds,
            dbName
        );
    }

    recordAzureSqlQuery(
        operation: string,
        durationSeconds: number,
        dbName?: string
    ): void {
        this.metricsService?.recordDbQuery(
            "mssql",
            operation,
            durationSeconds,
            dbName
        );
    }
}
