import { Router } from "express";
import { IControllerMetadata, IModuleMetadata } from "./decorators";

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

        // применяем маршруты контроллеров текущего модуля
        let r = this.applyModuleControllersRoutes(meta);
        meta.prefix ? router.use(meta.prefix, r) : router.use(r);

        // применяем маршруты подмодулей
        r = await this.applyModuleSubmodulesRoutes(meta);
        meta.prefix ? router.use(meta.prefix, r) : router.use(r);

        return router;
    }

    private static applyModuleControllersRoutes(moduleMeta: IModuleMetadata): Router {
        const router = Router();
        if (!moduleMeta.controllers)
            return router;

        for (const type of moduleMeta.controllers) {
            const controller = new type();
            const r = this.applyModuleControllerRoutes(controller, moduleMeta);
            router.use(r);
        }
        return router;
    }

    private static applyModuleControllerRoutes(controller: any, moduleMeta: IModuleMetadata): Router {
        if (!controller.__altexpress_controller_meta)
            throw new Error(`${controller} does not seem to be a valid controller.`);

        const router = Router();
        const meta = controller.__altexpress_controller_meta as IControllerMetadata;
        if (meta.routes) {
            router.use(meta.path, meta.routes);
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
}
