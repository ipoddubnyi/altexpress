import { Module, ServiceLifetime } from "@altcrm/altexpress";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { DateTimeService, DateTimeServiceFake } from "./datetime.service";

@Module({
    controllers: [
        OrderController,
        ClientController,
    ],
    services: [
        OrderService,
        { type: ClientService, lifetime: ServiceLifetime.Scoped },
        { type: DateTimeService, concrete: DateTimeServiceFake, lifetime: ServiceLifetime.Singleton },
    ],
})
export class OrderModule {}
