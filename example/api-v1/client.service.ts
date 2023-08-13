import { Inject } from "@altcrm/altexpress";
import { Client, ClientCreateDto, ClientUpdateDto } from "./client.schema";
import { DateTimeService } from "./datetime.service";

const Clients: Client[] = [
    { 
        id: 1,
        name: "Ivan",
        phone: "+79990000001",
        email: "ivan@client.ru",
        createdAt: new Date("2023-08-01T10:00:00Z"),
    },
    { 
        id: 2,
        name: "Sergey",
        phone: "+79990000002",
        email: "sergey@client.ru",
        createdAt: new Date("2023-08-02T10:00:00Z"),
    },
    { 
        id: 3,
        name: "Anna",
        phone: "+79990000003",
        email: "anna@client.ru",
        createdAt: new Date("2023-08-03T10:00:00Z"),
    },
];

export class ClientService {
    public constructor(
        @Inject(DateTimeService) private readonly dateTimeService: DateTimeService,
    ) {
        console.log("CREATE ClientService");
    }

    public async select(): Promise<Client[]> {
        return Clients;
    }

    public async search(search: string): Promise<Client[]> {
        return Clients.filter(c => c.name.includes(search) || c.description?.includes(search));
    }

    public async get(id: number): Promise<Client | null> {
        return Clients.find(c => c.id === id) ?? null;
    }

    public async create(dto: ClientCreateDto): Promise<Client | null> {
        const client = new Client();
        client.id = Clients[Client.length - 1].id + 1,
        client.name = dto.name;
        client.description = dto.description;
        client.phone = dto.phone;
        client.email = dto.email;
        client.createdAt = this.dateTimeService.now();

        Clients.push(client);

        return client;
    }

    public async update(id: number, dto: ClientUpdateDto): Promise<Client | null> {
        const client = await this.get(id);
        if (!client) {
            return null;
        }

        if (dto.name) {
            client.name = dto.name;
        }
        if (dto.description) {
            client.description = dto.description;
        }
        if (dto.phone) {
            client.phone = dto.phone;
        }
        if (dto.email) {
            client.email = dto.email;
        }

        return client;
    }

    public async updatePhone(id: number, phone: string): Promise<Client | null> {
        const client = await this.get(id);
        if (!client) {
            return null;
        }

        client.phone = phone;
        return client;
    }
}
