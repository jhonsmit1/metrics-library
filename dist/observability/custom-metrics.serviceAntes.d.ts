import { OnModuleInit } from "@nestjs/common";
import { ObservabilityOptions } from "./observability.interfaces";
export declare class CustomMetricsService implements OnModuleInit {
    private readonly options?;
    private readonly logger;
    private meter?;
    private dbQueryDurationSeconds?;
    private enabled;
    constructor(options?: ObservabilityOptions | undefined);
    onModuleInit(): void;
    private initializeMetrics;
    recordDbQuery(dbSystem: "postgresql" | "mssql", operation: string, durationSeconds: number, dbName?: string): void;
}
