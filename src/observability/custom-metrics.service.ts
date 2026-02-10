import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { metrics, Meter } from "@opentelemetry/api";

@Injectable()
export class CustomMetricsService implements OnModuleInit {
  private readonly logger = new Logger(CustomMetricsService.name);

  private meter?: Meter;
  private dbQueryDurationSeconds?: any;

  onModuleInit() {
    this.meter = metrics.getMeter("database-lib", "1.0.0");
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

    this.logger.log("Database query histogram registered");
  }

  recordDbQuery(
    dbSystem: "postgresql" | "mssql",
    operation: string,
    durationSeconds: number,
    dbName?: string
  ): void {
    this.logger.debug(
      `Recording DB metric | system=${dbSystem} operation=${operation} duration=${durationSeconds}s`
    );

    if (!this.dbQueryDurationSeconds) {
      this.logger.warn("DB metrics histogram not initialized");
      return;
    }

    const attributes: Record<string, string> = {
      db_system: dbSystem,
      db_operation: operation,
    };

    if (dbName) {
      attributes.db_name = dbName;
    }

    this.dbQueryDurationSeconds.record(durationSeconds, attributes);
  }
}
