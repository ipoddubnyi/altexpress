import { Inject } from "@altcrm/altexpress";
import { Order, OrderCreateDto, OrderUpdateDto } from "./order.schema";
import { DateTimeService } from "./datetime.service";

const Orders: Order[] = [
    { 
        id: 1,
        description: "Phone repair",
        clientId: 1,
        createdAt: new Date("2023-08-01T10:00:00Z"),
    },
    { 
        id: 2,
        description: "Notebook repair",
        clientId: 1,
        createdAt: new Date("2023-08-01T10:00:00Z"),
    },
    { 
        id: 3,
        description: "PC repair",
        clientId: 2,
        createdAt: new Date("2023-08-02T10:00:00Z"),
    },
];

export class OrderService {
    public constructor(
        @Inject(DateTimeService) private readonly dateTimeService: DateTimeService,
    ) {
        console.log("CREATE OrderService");
    }

    public async select(): Promise<Order[]> {
        return Orders;
    }

    public async search(search: string): Promise<Order[]> {
        return Orders.filter(c => c.description.includes(search) || c.description?.includes(search));
    }

    public async get(id: number): Promise<Order | null> {
        return Orders.find(c => c.id === id) ?? null;
    }

    public async create(dto: OrderCreateDto): Promise<Order | null> {
        const order = new Order();
        order.id = Orders[Order.length - 1].id + 1,
        order.description = dto.description;
        order.clientId = dto.clientId;
        order.createdAt = this.dateTimeService.now();

        Orders.push(order);

        return order;
    }

    public async update(id: number, dto: OrderUpdateDto): Promise<Order | null> {
        const order = await this.get(id);
        if (!order) {
            return null;
        }

        if (dto.description) {
            order.description = dto.description;
        }
        if (dto.clientId) {
            order.clientId = dto.clientId;
        }

        return order;
    }
}
