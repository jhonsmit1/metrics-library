export interface ObservabilityOptions {
    serviceName: string;
    serviceVersion?: string;
    enabled?: boolean;
    enableHttpMetrics?: boolean;
    enableErrorMetrics?: boolean;
    enableAuthMetrics?: boolean;
}
