import * as express from "express";
import { Reflector } from "./reflector";
import HttpResponse from "./httpResponse";

export interface IApplication {
    setGlobalPrefix(prefix: string): void;
    use(...args: any[]): void;
    listen(port: number): Promise<void>;
}

export interface IConfigurableModule {
    configure(): Promise<void>;
}

export class Application implements IApplication {
    private readonly app: express.Application;
    private readonly moduleType: any;
    private globalPrefix: string | null = null;

    public constructor(moduleType: any) {
        this.app = express();
        this.moduleType = moduleType;

        // базовая конфигурация
        this.configure();
    }

    private configure(): void {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    private async applyRoutes(): Promise<void> {
        const module = await Reflector.createModuleInstance(this.moduleType);
        const router = await Reflector.applyModuleRoutes(module);
        this.globalPrefix ? this.app.use(this.globalPrefix, router) : this.app.use(router);

        this.app.use((req: express.Request, res: express.Response, _: Function) => {
            res.status(404).send("Page is not found.");
        });

        this.app.use((err: Error, req: express.Request, res: express.Response, _: Function) => {
            console.error(err.stack);
            HttpResponse.error(res, err);
        });
    }

    public setGlobalPrefix(prefix: string): void {
        this.globalPrefix = prefix;
    }

    public use(...args: any[]): void {
        this.app.use(...args);
    }

    public async listen(port: number): Promise<void> {
        await this.applyRoutes();
        return new Promise(resolve => this.app.listen(port, resolve));
    }
}
