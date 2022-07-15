export class Client {
    public id!: number;
    public name!: string;
    public description?: string;
    public phone!: string;
    public email!: string;
}

export class ClientUpdateDto {
    public name?: string;
    public description?: string;
    public phone?: string;
    public email?: string;
}
