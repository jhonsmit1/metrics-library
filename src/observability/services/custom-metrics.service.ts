import {
    Injectable,
    Logger,
    OnModuleInit,
    Inject,
    Optional,
} from "@nestjs/common";
import { metrics, Meter } from "@opentelemetry/api";
import { OBSERVABILITY_OPTIONS } from "../observability.constants";
import { ObservabilityOptions } from "../observability.interfaces";

@Injectable()
export class CustomMetricsService implements OnModuleInit {
    private readonly logger = new Logger(CustomMetricsService.name);

    private meter?: Meter;

    private httpRequestsTotal?: any;
    private httpRequestDurationMs?: any;
    private dbQueryDurationSeconds?: any;
    private appErrorsTotal?: any;
    private authFailedAttemptsTotal?: any;

    private enabled = true;

    constructor(
        @Optional()
        @Inject(OBSERVABILITY_OPTIONS)
        private readonly options?: ObservabilityOptions
    ) { }

    onModuleInit() {
        this.enabled = this.options?.enabled !== false;

        if (!this.enabled) {
            this.logger.warn("Observability metrics disabled");
            return;
        }

        const serviceName = this.options?.serviceName ?? "unknown-service";
        const version = this.options?.serviceVersion ?? "1.0.0";

        this.meter = metrics.getMeter(serviceName, version);
        this.initializeMetrics();

        this.logger.log("CustomMetricsService initialized");
    }

    private initializeMetrics() {
        if (!this.meter) return;

        this.httpRequestsTotal = this.meter.createCounter("http_requests_total", {
            description: "Total number of HTTP requests",
            unit: "1",
        });

        this.httpRequestDurationMs = this.meter.createHistogram(
            "http_request_duration_ms",
            {
                description: "HTTP request duration in milliseconds",
                unit: "ms",
            }
        );

        this.dbQueryDurationSeconds = this.meter.createHistogram(
            "db_query_duration_seconds",
            {
                description: "Database query duration in seconds",
                unit: "s",
            }
        );

        this.appErrorsTotal = this.meter.createCounter("app_errors_total", {
            description: "Total number of application errors",
            unit: "1",
        });

        this.authFailedAttemptsTotal = this.meter.createCounter(
            "auth_failed_attempts_total",
            {
                description: "Total number of failed authentication attempts",
                unit: "1",
            }
        );
    }

    // ---------------- HTTP ----------------

    recordHttpRequest(
        method: string,
        endpoint: string,
        statusCode: number,
        durationMs: number,
        version = "v1"
    ) {
        if (!this.enabled) return;

        const attributes = {
            method,
            endpoint,
            status_code: statusCode.toString(),
            version,
        };

        this.httpRequestsTotal?.add(1, attributes);
        this.httpRequestDurationMs?.record(durationMs, attributes);
    }

    // ---------------- DB ----------------

    recordDbQuery(
        dbSystem: "postgresql" | "mssql",
        operation: string,
        durationSeconds: number,
        dbName?: string
    ) {
        if (!this.enabled) return;

        const attributes: Record<string, string> = {
            db_system: dbSystem,
            db_operation: operation,
        };

        if (dbName) attributes.db_name = dbName;

        this.dbQueryDurationSeconds?.record(durationSeconds, attributes);
    }

    // ---------------- Errors ----------------

    recordAppError(
        errorType: string,
        endpoint: string,
        statusCode: number,
        severity: "error" | "warning" = "error"
    ) {
        if (!this.enabled) return;

        this.appErrorsTotal?.add(1, {
            error_type: errorType,
            endpoint,
            status_code: statusCode.toString(),
            severity,
        });
    }

    // ---------------- Auth ----------------

    recordAuthFailure(
        reason:
            | "invalid_token"
            | "expired_token"
            | "missing_token"
            | "invalid_api_key",
        endpoint: string
    ) {
        if (!this.enabled) return;

        this.authFailedAttemptsTotal?.add(1, {
            reason,
            endpoint,
        });
    }
}
