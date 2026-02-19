import { CustomMetricsService } from "./custom-metrics.serviceAntes";
export declare class DatabaseMetricsFacade {
    private readonly metricsService?;
    constructor(metricsService?: CustomMetricsService | undefined);
    recordPostgresQuery(operation: string, durationSeconds: number, dbName?: string): void;
    recordAzureSqlQuery(operation: string, durationSeconds: number, dbName?: string): void;
}
