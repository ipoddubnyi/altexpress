import { Response } from "express";
import { HttpException } from "./exceptions";

export default class HttpResponse {
    public static error(res: Response, e: Error): void {
        if (e instanceof HttpException) {
            res.status(e.code).json({
                code: e.code,
                message: e.message
            });
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal server error."
            });
        }
    }

    public static success(res: Response, body: any): void {
        res.status(200).json(body);
    }

    public static successCreated(res: Response, body: any): void {
        res.status(201).json(body);
    }

    public static successNoContent(res: Response): void {
        res.status(204).json({});
    }
}
