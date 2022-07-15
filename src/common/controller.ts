import { Request, Response } from "express";

export class ControllerBase {
    protected request!: Request;
    protected response!: Response;
}
