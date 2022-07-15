import { Module } from "@altcrm/altexpress";
import { ClientController } from "./client.controller";

@Module({
    controllers: [
        ClientController,
    ]
})
export class ClientModule {}
