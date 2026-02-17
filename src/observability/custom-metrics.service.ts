import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  Optional,
} from "@nestjs/common";
import { metrics, Meter } from "@opentelemetry/api";
import { OBSERVABILITY_OPTIONS } from "./observability.constants";
import { ObservabilityOptions } from "./observability.interfaces";

@Injectable()
export class CustomMetricsService implements OnModuleInit {
  private readonly logger = new Logger(CustomMetricsService.name);

  private meter?: Meter;
  private dbQueryDurationSeconds?: any;
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

    this.dbQueryDurationSeconds = this.meter.createHistogram(
      "db_query_duration_seconds",
      {
        description: "Database query duration in seconds",
        unit: "s",
      }
    );
  }

  recordDbQuery(
    dbSystem: "postgresql" | "mssql",
    operation: string,
    durationSeconds: number,
    dbName?: string
  ): void {
    if (!this.enabled || !this.dbQueryDurationSeconds) return;

    this.dbQueryDurationSeconds.record(durationSeconds, {
      "db.system": dbSystem,
      "db.operation": operation,
      ...(dbName && { "db.name": dbName }),
    });
  }
}
