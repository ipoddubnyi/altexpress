import { Router, Request, Response, NextFunction } from "express";
import { extractParameters, IControllerMetadata, IModuleMetadata, ServiceLifetime } from "./decorators";
import { HttpResponse } from "./http-response";
import { DIContainer } from "./di-container";

export class Reflector {

    public static async createModuleInstance(type: any): Promise<any> {
        const module = new type();
        if (this.isConfigurableModule(module)) {
            await module.configure();
        }
        return module;
    }

    private static isConfigurableModule(module: any): boolean {
        return module.configure;
    }

    public static async applyModuleRoutes(module: any): Promise<Router> {
        if (!module.__altexpress_module_meta)
            throw new Error(`${module} does not seem to be a valid module.`);

        const router = Router();
        const meta = module.__altexpress_module_meta as IModuleMetadata;
        const diContainer = this.createDIContainer(meta);

        // применяем маршруты контроллеров текущего модуля
        let r = this.applyModuleControllersRoutes(meta, diContainer);
        meta.prefix ? router.use(meta.prefix, r) : router.use(r);

        // применяем маршруты подмодулей
        r = await this.applyModuleSubmodulesRoutes(meta);
        meta.prefix ? router.use(meta.prefix, r) : router.use(r);

        return router;
    }

    private static createDIContainer(moduleMeta: IModuleMetadata): DIContainer {
        const diContainer = new DIContainer();

        if (moduleMeta.services) {
            for (const service of moduleMeta.services) {
                const type = service.type ?? service;
                const concrete = service.concrete ?? type;
                const lifetime = service.lifetime ?? ServiceLifetime.Scoped;

                diContainer.register(type, concrete, lifetime);
            }
        }

        return diContainer;
    }

    private static applyModuleControllersRoutes(moduleMeta: IModuleMetadata, diContainer: DIContainer): Router {
        const router = Router();
        if (!moduleMeta.controllers)
            return router;

        for (const controllerType of moduleMeta.controllers) {
            const r = this.applyModuleControllerRoutes(controllerType, diContainer);
            router.use(r);
        }
        return router;
    }

    private static applyModuleControllerRoutes(controllerType: any, diContainer: DIContainer): Router {
        if (!controllerType.__altexpress_controller_meta)
            throw new Error(`${controllerType} does not seem to be a valid controller.`);

        const router = Router();
        const meta = controllerType.__altexpress_controller_meta as IControllerMetadata;
        const r = this.applyModuleControllerMethods(controllerType, diContainer);
        router.use(meta.path, r);
        return router;
    }

    private static applyModuleControllerMethods(controllerType: any, diContainer: DIContainer): Router {
        const meta = controllerType.__altexpress_controller_meta as IControllerMetadata;

        const router = Router({ mergeParams: true });
        for (const route of meta.routes) {
            const handler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
                diContainer.clearScoped();
                const params = diContainer.resolveParameters(controllerType);
                
                const controller = new controllerType(...params);
                controller.request = req;
                controller.response = res;

                const args = extractParameters(req, res, next, meta.params[route.property]);
                const bound = route.handler.bind(controller, ...args);
                await this.decorateMethod(bound, req, res, next);
            }

            (router as any)[route.method](route.path, ...route.middleware, handler);
        }
        return router;
    }

    private static async applyModuleSubmodulesRoutes(moduleMeta: IModuleMetadata): Promise<Router> {
        const router = Router();
        if (!moduleMeta.modules)
            return router;

        for (const type of moduleMeta.modules) {
            const module = await this.createModuleInstance(type);
            const r = await this.applyModuleRoutes(module);
            router.use(r);
        }
        return router;
    }

    private static async decorateMethod(
        fun: Function,
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const result = await fun(req, res, next);
    
            if (result instanceof HttpResponse) {
                res.status(result.status).json(result.body);
                return;
            }

            if (res.getHeader("Content-Type")) {
                res.status(200).send(result);
                return;
            }
            
            res.status(200).json(result);
        } catch (e: any) {
            next(e);
        }
    }
}
