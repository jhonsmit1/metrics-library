import { DynamicModule } from "@nestjs/common";
import { ObservabilityOptions } from "./observability.interfaces";
export declare class ObservabilityModule {
    static forRootAsync(options: {
        useFactory: (...args: any[]) => ObservabilityOptions;
        inject?: any[];
    }): DynamicModule;
}
