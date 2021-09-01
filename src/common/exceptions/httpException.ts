export class HttpException extends Error {
    private _code: number;

    public get code(): number {
        return this._code;
    }

    public get message(): string {
        return this.message;
    }

    constructor(code: number, message: string) {
        super(message);
        this._code = code;
    }
}
