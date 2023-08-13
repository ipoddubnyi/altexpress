import { Module } from "@altcrm/altexpress";
import { OrderModule } from "./order.module";

@Module({
    prefix: "/api/v1",
    modules: [
        OrderModule,
    ]
})
export class ApiV1Module {}
