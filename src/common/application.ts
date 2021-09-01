import express from "express";
import { Reflector } from "./reflector";
import HttpResponse from "./httpResponse";

export interface IApplication {
    setGlobalPrefix(prefix: string): void;
    use(...args: any[]): void;
    listen(port: number): Promise<void>;
}

export class Application implements IApplication {
    private readonly app: express.Application;
    private readonly module: any;
    private globalPrefix: string | null = null;

    public constructor(module: any) {
        this.app = express();
        this.module = module;

        // базовая конфигурация
        this.configure();
    }

    private configure(): void {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    private applyRoutes(): void {
        Reflector.applyModuleRoutes(new this.module(), this.applyRoute);

        this.app.use((req: express.Request, res: express.Response, _: Function) => {
            res.status(404).send("Page is not found.");
        });

        this.app.use((err: Error, req: express.Request, res: express.Response, _: Function) => {
            console.error(err.stack);
            HttpResponse.error(res, err);
        });
    }

    private applyRoute(router: express.Router, prefix?: string): void {
        if (prefix) {
            this.app.use(prefix, router);
            return;
        }

        if (this.globalPrefix) {
            this.app.use(this.globalPrefix, router);
            return;
        }

        this.app.use(router);
    }

    public setGlobalPrefix(prefix: string): void {
        this.globalPrefix = prefix;
    }

    public use(...args: any[]): void {
        this.app.use(...args);
    }

    public listen(port: number): Promise<void> {
        this.applyRoutes();
        return new Promise(resolve => this.app.listen(port, resolve));
    }
}
