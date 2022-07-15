import { Client, ClientUpdateDto } from "./client.schema";

const Clients: Client[] = [
    { 
        id: 1,
        name: "Ivan",
        phone: "+79990000001",
        email: "ivan@client.ru",
    },
    { 
        id: 2,
        name: "Sergey",
        phone: "+79990000002",
        email: "sergey@client.ru",
    },
    { 
        id: 3,
        name: "Anna",
        phone: "+79990000003",
        email: "anna@client.ru",
    },
];

export class ClientService {
    public async select(): Promise<Client[]> {
        return Clients;
    }

    public async search(search: string): Promise<Client[]> {
        return Clients.filter(c => c.name.includes(search) || c.description?.includes(search));
    }

    public async get(id: number): Promise<Client | null> {
        return Clients.find(c => c.id === id) ?? null;
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
