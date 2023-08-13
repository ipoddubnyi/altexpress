import { Body, Controller, ControllerBase, Get, Inject, Params, Post, processors, Put, Query } from "@altcrm/altexpress";
import { Order, OrderCreateDto, OrderUpdateDto } from "./order.schema";
import { Client } from "./client.schema";
import { OrderService } from "./order.service";
import { ClientService } from "./client.service";
import { DateTimeService } from "./datetime.service";
import { Guard } from "../utils/guard";

// route: /api/v1/orders

@Controller("/orders")
export class OrderController extends ControllerBase {
    public constructor(
        @Inject(OrderService) private readonly orderService: OrderService,
        @Inject(ClientService) private readonly clientService: ClientService,
        @Inject(DateTimeService) private readonly dateTimeService: DateTimeService,
    ) {
        super();
    }

    @Get("/test", Guard.Auth)
    public test(): Date {
        return this.dateTimeService.now();
    }

    @Get("/", Guard.Auth)
    public async select(): Promise<Order[]> {
        return await this.orderService.select();
    }

    @Get("/search", Guard.Auth)
    public async search(
        @Query("search") search: string
    ): Promise<Order[]> {
        return await this.orderService.search(search);
    }

    @Get("/:id", Guard.Auth)
    public async get(
        @Params("id", processors.toInteger) id: number
    ): Promise<Order> {
        const order = await this.orderService.get(id);
        if (!order) {
            throw new Error("Order is not found.");
        }
        return order;
    }

    @Get("/:id/client", Guard.Auth)
    public async getClient(
        @Params("id", processors.toInteger) id: number
    ): Promise<Client> {
        const order = await this.orderService.get(id);
        if (!order) {
            throw new Error("Order is not found.");
        }

        const client = await this.clientService.get(order.clientId);
        if (!client) {
            throw new Error("Client is not found.");
        }

        return client;
    }

    @Post("/", Guard.Auth)
    public async create(
        @Body() dto: OrderCreateDto
    ): Promise<Order> {
        const order = await this.orderService.create(dto);
        if (!order) {
            throw new Error("Order is not created.");
        }
        return order;
    }

    @Put("/:id", Guard.Auth)
    public async update(
        @Params("id", processors.toInteger) id: number,
        @Body() dto: OrderUpdateDto
    ): Promise<Order> {
        const order = await this.orderService.update(id, dto);
        if (!order) {
            throw new Error("Order is not found.");
        }
        return order;
    }
}
