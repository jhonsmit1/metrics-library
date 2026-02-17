import { DynamicModule } from "@nestjs/common";
import { ObservabilityOptions } from "./observability.interfaces";
export declare class ObservabilityModule {
    static forRoot(options: ObservabilityOptions): DynamicModule;
}
