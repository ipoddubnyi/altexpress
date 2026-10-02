import * as express from "express";
import { Reflector } from "./reflector";
import { HttpException } from "./exceptions";

export interface IApplication {
    setGlobalPrefix(prefix: string): void;
    use(...args: any[]): void;
    listen(port: number): Promise<void>;
}

export interface IConfigurableModule {
    configure(): Promise<void>;
}

export interface IApplicationOptions {
    /**
     * Наибольший размер тела JSON: число байт или строка вида "5mb".
     * По умолчанию — как в express, 100kb. Больше — ответ 413.
     */
    jsonLimit?: number | string;
}

export class Application implements IApplication {
    protected readonly app: express.Application;
    protected readonly moduleType: any;
    protected readonly options: IApplicationOptions;
    protected globalPrefix: string | null = null;

    public constructor(moduleType: any, options: IApplicationOptions = {}) {
        this.app = express();
        this.moduleType = moduleType;
        this.options = options;

        // базовая конфигурация
        this.configure();
    }

    protected configure(): void {
        this.app.use(express.urlencoded({
            extended: true,
            verify: function (req, res, buf, encoding) {
                (req as any).rawBody = buf;
            }
        }));
        this.app.use(express.json({
            limit: this.options.jsonLimit,
            verify: function (req, res, buf, encoding) {
                (req as any).rawBody = buf;
            }
        }));
    }

    protected async applyRoutes(): Promise<void> {
        const module = await Reflector.createModuleInstance(this.moduleType);
        const router = await Reflector.applyModuleRoutes(module);
        this.globalPrefix ? this.app.use(this.globalPrefix, router) : this.app.use(router);

        this.app.use((req: express.Request, res: express.Response, _: Function) => {
            res.status(404).send("Page is not found.");
        });

        this.app.use((e: Error, req: express.Request, res: express.Response, _: Function) => {
            console.error(e);

            if (e instanceof HttpException) {
                res.status(e.status).json(e.toObject());
                return;
            }

            // Ошибки разбора тела (express.json, express.urlencoded) несут свой статус:
            // 413 — тело больше лимита, 400 — кривой JSON. Это ошибка запроса, а не сервера.
            const status = (e as any).status;
            if ((e as any).expose && typeof status === "number" && status >= 400 && status < 500) {
                res.status(status).json({ message: e.message });
                return;
            }
    
            res.status(500).json({ message: "Internal server error." });
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
