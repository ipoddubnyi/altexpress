export class HttpException extends Error {
    private readonly _status: number;

    public constructor(status: number, message: string) {
        super(message);
        this._status = status;
    }

    public get status(): number {
        return this._status;
    }

    public get message(): string {
        return this.message;
    }

    public toObject(): any {
        return {
            status: this.status,
            message: this.message
        };
    }
}
