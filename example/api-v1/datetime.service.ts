export class DateTimeService {
    public constructor() {
        console.log("CREATE DateTimeService");
    }

    public now(): Date {
        return new Date();
    }
}

export class DateTimeServiceFake extends DateTimeService {
    public now(): Date {
        return new Date("2023-07-01T12:00:00Z");
    }
}
