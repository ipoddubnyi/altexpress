import { HttpException } from "./exceptions";

export class HttpResponse<T = any> {
    private readonly _status: number;
    private readonly _body: T;

    public constructor(status: number, body: T) {
        this._status = status;
        this._body  = body;
    }

    public get status(): number {
        return this._status;
    }

    public get body(): T {
        return this._body;
    }

    public static success<T = any>(body: T): HttpResponse<T> {
        return new HttpResponse(200, body);
    }

    public static successCreated<T = any>(body: T): HttpResponse<T> {
        return new HttpResponse(201, body);
    }

    public static successNoContent(): HttpResponse {
        return new HttpResponse(204, {});
    }

    public static error(e: Error): HttpResponse {
        if (e instanceof HttpException) {
            return new HttpResponse(e.status, e.toObject());
        }

        return new HttpResponse(500, { message: "Internal server error." });
    }
}
