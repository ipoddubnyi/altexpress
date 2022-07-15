import { Module } from "@altcrm/altexpress";
import { ClientModule } from "./client.module";

@Module({
    prefix: "/api/v1",
    modules: [
        ClientModule,
    ]
})
export class ApiV1Module {}
