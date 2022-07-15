import { Module } from "@altcrm/altexpress";
import { ApiV1Module } from "./api-v1/api-v1.module";

@Module({
    modules: [
        ApiV1Module
    ]
})
export class ApplicationModule {}
