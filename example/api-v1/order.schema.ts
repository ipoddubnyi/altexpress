export class Order {
    public id!: number;
    public description!: string;
    public clientId!: number;
    public createdAt!: Date;
}

export class OrderCreateDto {
    public description!: string;
    public clientId!: number;
}

export class OrderUpdateDto {
    public description?: string;
    public clientId?: number;
}
