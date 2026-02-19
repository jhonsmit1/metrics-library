import { OnModuleInit } from "@nestjs/common";
import { ObservabilityOptions } from "../observability.interfaces";
export declare class CustomMetricsService implements OnModuleInit {
    private readonly options?;
    private readonly logger;
    private meter?;
    private httpRequestsTotal?;
    private httpRequestDurationMs?;
    private dbQueryDurationSeconds?;
    private appErrorsTotal?;
    private authFailedAttemptsTotal?;
    private enabled;
    constructor(options?: ObservabilityOptions | undefined);
    onModuleInit(): void;
    private initializeMetrics;
    recordHttpRequest(method: string, endpoint: string, statusCode: number, durationMs: number, version?: string): void;
    recordDbQuery(dbSystem: "postgresql" | "mssql", operation: string, durationSeconds: number, dbName?: string): void;
    recordAppError(errorType: string, endpoint: string, statusCode: number, severity?: "error" | "warning"): void;
    recordAuthFailure(reason: "invalid_token" | "expired_token" | "missing_token" | "invalid_api_key", endpoint: string): void;
}
