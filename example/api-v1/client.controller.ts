import { Body, Controller, ControllerBase, Get, Params, Patch, processors, Put, Query } from "@altcrm/altexpress";
import { Client, ClientUpdateDto } from "./client.schema";
import { ClientService } from "./client.service";
import { Guard } from "../utils/guard";

// route: /api/v1/clients

@Controller("/clients")
export class ClientController extends ControllerBase {
    public constructor(
        private readonly clientService = new ClientService(),
    ) {
        super();
    }

    @Get("/", Guard.Auth)
    public async select(): Promise<Client[]> {
        return await this.clientService.select();
    }

    @Get("/search", Guard.Auth)
    public async search(
        @Query("search") search: string
    ): Promise<Client[]> {
        return await this.clientService.search(search);
    }

    @Get("/:id", Guard.Auth)
    public async get(
        @Params("id", processors.toInteger) id: number
    ): Promise<Client> {
        const client = await this.clientService.get(id);
        if (!client) {
            throw new Error("Cleint is not found.");
        }
        return client;
    }

    @Put("/:id", Guard.Auth)
    public async update(
        @Params("id", processors.toInteger) id: number,
        @Body() dto: ClientUpdateDto
    ): Promise<Client> {
        const client = await this.clientService.update(id, dto);
        if (!client) {
            throw new Error("Cleint is not found.");
        }
        return client;
    }

    @Patch("/:id", Guard.Auth)
    public async updatePhone(
        @Params("id", processors.toInteger) id: number,
        @Body("phone") phone: string
    ): Promise<Client> {
        const client = await this.clientService.updatePhone(id, phone);
        if (!client) {
            throw new Error("Cleint is not found.");
        }
        return client;
    }
}
