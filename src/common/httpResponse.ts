import { HttpException } from "./exceptions";

export class HttpResponse {
    private readonly _status: number;
    private readonly _body: any;

    public constructor(status: number, body: any) {
        this._status = status;
        this._body  = body;
    }

    public get status(): number {
        return this._status;
    }

    public get body(): any {
        return this._body;
    }

    public static success(body: any): HttpResponse {
        return new HttpResponse(200, body);
    }

    public static successCreated(body: any): HttpResponse {
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
